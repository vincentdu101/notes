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
        var w = 600;
        var metrics = [];
        var padding = 75;
        var format = d3.time.format("%Y");
        var radius = 10;
        var created = false;


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

        function genXScale(years) {
          return d3.scale.linear()
                  .domain(years)
                  .range([0, w]);
        }

        function genYScale(popRange) {
          return d3.scale.linear()
                   .domain(popRange)
                   .range([h, 0])
                   .nice();
        }

        function createChart(data) {

          var years = parseYearDomain();
          var popRange = parsePopulationRange(data);
          
          var tooltip = d3.select(".target").append("div")
                          .attr('class', 'line-tooltip')
                          .style('opacity', 0);

          var xScale = genXScale(years);
          var yScale = genYScale(popRange);

          var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          var lineFun = d3.svg.line()
                          .x(function(d){ return xScale(d.year); })
                          .y(function(d){ return yScale(d.population); })
                          .interpolate('linear');

          var svg = d3.select('.target')
                      .select('svg')
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
          
          var viz = svg.append('path')
                       .transition()
                       .duration(3000)
                       .ease('elastic')
                       .attr({
                         d: lineFun(data),
                         'stroke': 'black',
                         'stroke-width': 2,
                         'fill': 'none',
                         'class': 'path line-path'
                       });

          var dots = svg.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr({
                          cx: function(d) { return xScale(d.year); },
                          cy: function(d) { return yScale(d.population); },
                          r: radius,
                          class: function(d) { return 'bubble bubble-' + d.year}
                        })
                      .on('click', function(d){
                        var output = '<strong>Population ' + d.population + "</strong>";
                        output += "<br /><strong>Year " + d.year + "</strong";
                        d3.selectAll(".bubble").classed("bubble-selected", false)
                        d3.select(".bubble-" + d.year).classed("bubble-selected", true)
                        tooltip.transition()
                              .duration(500)
                              .style('opacity', 1)
                        tooltip.html(output)
                              .style('left', 0 + "px")
                              .style('top', 350 + "px");
                      });
        
        }

        function updateChart(data) {
          var years = parseYearDomain();
          var popRange = parsePopulationRange(data);

          var xScale = genXScale(years);
          var yScale = genYScale(popRange);

          var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10);
          var xAxis = d3.svg.axis().scale(xScale).orient('bottom');

          var lineFun = d3.svg.line()
                          .x(function(d){ return xScale(d.year); })
                          .y(function(d){ return yScale(d.population); })
                          .interpolate('linear');

          var svg = d3.select('.target').select('svg');
          
          var viz = svg.select('.line-path')
                       .transition()
                       .duration(500)
                       .ease('linear')
                       .attr({
                         d: lineFun(data),
                       });

          var dots = svg.selectAll('circle')
                        .data(data)
                        .transition()
                        .duration(500)
                        .attr({
                          cx: function(d) { return xScale(d.year); },
                          cy: function(d) { return yScale(d.population); },
                          r: radius,
                          class: function(d) { return 'bubble bubble-' + d.year}
                        });          
        }

        PopulationHistory.init().then(function(){
          storeData();
        });

        $rootScope.$on('selectState', function(event, data) {
          var focusState = states[data.state];
          if (!created) {
            created = true;
            createChart(focusState);
          } else {
            $(".line-tooltip").empty();
            updateChart(focusState);
          }
        });

      }
    };

  }
])