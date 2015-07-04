app.directive('linePopulationChart', [
  'PopulationHistory',
  '$rootScope',
  function(PopulationHistory, $rootScope) {

    return {
      restrict: "E",
      scope: {

      }, 
      templateUrl: "templates/shared/linePopulationChart.html",
      controller: function($scope) {

        var states = {},
            dates = {};
        var h = 300;
        var w = 700;
        var metrics = [];
        var padding = 50;
        var format = d3.time.format("%Y");


        function storeData() {
          states = PopulationHistory.states;
          dates = PopulationHistory.dates;
        }

        function parseYearDomain() {
          var years = Object.keys(PopulationHistory.dates);
          var minYear = parseInt(years[0]);
          var maxYear = parseInt(years[years.length - 1]);
          return [minYear, maxYear];
        }

        function parsePopulationRange(data) {
          var maxPopulation = 0,
              minPopulation = 0;          
          for(var i = 0; i < data.length; i++) {
            var population = parseInt(data[i].population);
            if (population > maxPopulation) {
              maxPopulation = population;
            } else if (population < minPopulation) {
              minPopulation = population;
            }

            if (minPopulation == 0) {
              minPopulation = population;
            }            
          };
          return [0, maxPopulation];
        }

        function createChart(data) {

          var years = parseYearDomain();
          var popRange = parsePopulationRange(data);
          
          var tooltip = d3.select(".target").append("div")
                          .attr('class', 'line-tooltip')
                          .style('opacity', 0);

          var xScale = d3.scale.linear()
                         .domain(years)
                         .range([0, w]);

          var yScale = d3.scale.linear()
                         .domain(popRange)
                         .range([h, 0])
                         .nice();

          var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          var lineFun = d3.svg.line()
                          .x(function(d){ return xScale(d.year); })
                          .y(function(d){ return yScale(d.population); })
                          .interpolate('linear');

          var svg = d3.select('.target')
                      .append('svg')
                      .attr({width: w + padding, height: h + padding, "id": "svg-line"})
                      .style({"padding-left":"70px", "padding-top": "20px"});

          var yAxisGen = svg.append('g')
                            .attr('class', 'y-axis')
                            .attr('transform', 'translate(' + 0 + ', 0)')
                            .call(yAxis);

          var xAxisGen = svg.append('g')
                            .attr('class', 'x-axis')
                            .attr('transform', 'translate(0, ' + (h) + ")")
                            .call(xAxis);
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
                          cx: function(d) { return xScale(d.year); },
                          cy: function(d) { return yScale(d.population); },
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