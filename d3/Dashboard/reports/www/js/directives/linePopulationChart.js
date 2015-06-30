app.directive('linePopulationChart', [
  'PopulationHistory',
  '$rootScope',
  function(PopulationHistory, $rootScope) {

    return {
      restrict: "A",
      scope: {

      }, 
      templateUrl: "templates/shared/linePopulationChart.html",
      controller: function($scope) {

        var states = {},
            dates = {},
            maxPopulation = {};
        var h = 300;
        var w = 500;
        var metrics = [];
        var padding = 20;



        function storeData() {
          states = PopulationHistory.states;
          dates = PopulationHistory.dates;
          maxPopulation = PopulationHistory.maxPopulation;
        }

        function parseYearDomain() {
          var years = Object.keys(PopulationHistory.dates);
          var minYear = parseInt(years[0]);
          var maxYear = parseInt(years[years.length - 1]);
          return [minYear, maxYear];
        }

        function createChart(data) {

          var years = parseYearDomain();
          
          var tooltip = d3.select(".target").append("div")
                          .attr('class', 'tooltip')
                          .style('opacity', 0);

          var xScale = d3.time.scale()
                         .domain(years)
                         .range([padding, w - padding]);

          var yScale = d3.scale.linear()
                         .domain([0, parseInt(PopulationHistory.maxPopulation)])
                         .range([h - padding, 10])
                         .nice();

          var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          var lineFun = d3.svg.line()
                          .x(function(d){ return xScale(parseInt(d.year)); })
                          .y(function(d){ return yScale(parseInt(d.population)); })
                          .interpolate('linear');

          var svg = d3.select('.target')
                      .append('svg')
                      .attr({width: w, height: h, "id": "svg-line"});

          var yAxisGen = svg.append('g').call(yAxis)
                            .attr('class', 'y-axis')
                            .attr('transform', 'translate(' + padding + ', 0)');

          var xAxisGen = svg.append('g').call(xAxis)
                            .attr('class', 'x-axis')
                            .attr('transform', 'translate(0, ' + (h - padding) + ")");
          console.log(data);
          var viz = svg.append('path')
                       .attr({
                         d: lineFun(data),
                         'stroke': 'purple',
                         'stroke-width': 2,
                         'fill': 'none',
                         'class': 'path'
                       });

          var dots = svg.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr({
                          cx: function(d) { return xScale(parseInt(d.year)); },
                          cy: function(d) { return yScale(parseInt(d.population)); },
                          r: 4,
                          'fill': '#666666',
                          class: 'circle'
                        })
                      .on('mouseover', function(d){
                        tooltip.transition()
                              .duration(500)
                              .style('opacity', .85)
                        tooltip.html('<strong>Population ' + d.population + "</strong>")
                              .style('left', (d3.event.pageX) + "px")
                              .style('top', (d3.event.pageY - 28) + "px");
                      })
                      .on('mouseout', function(d){
                        tooltip.transition()
                              .duration(300)
                              .style('opacity', 0);
                      });
        
        }

        PopulationHistory.init().then(function(){
          storeData();
        });

        $rootScope.$on('selectState', function(event, data) {
          var focusState = states[data.state];
          createChart(focusState);
        });

      }
    };

  }
])