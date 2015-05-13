app.directive('barGraph', function(){

  return {
    restrict: "E",
    scope: {
      allData: "=",
      title: "@",
      key: "@",
      target: "@"
    },
    templateUrl: "templates/shared/barGraph.html",
    controller: function($scope) {
      $scope.createPopulationBar = function(options) {
        var data = options.data;
        var title = options.title;
        var key = options.key;
        var target = options.target;
        var dataset = [];
        var message = '<b>Hover a time period<br /> to see data</b>';
        
        for (var i = 0; i < data.length; i++) {
          dataset.push({era: data[i].era, pop: data[i].data[key]});
        }

        // margins are used to assume the spacing of the axes
        var margin = {top: 20, right: 80, bottom: 30, left: 80};

        // calculate width and height with axes margins in mind
        var width = 500 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;
        var padding = 10;

        // width of a bar
        var barWidth = width / dataset.length;      

        // x values for the years
        var years = dataset.map(function(d){ return d.era; });

        // y values for the population
        var populations = dataset.map(function(d){ return d.pop; });

        // x scale to be used in x-axis
        var xScale = d3.scale.linear()
                      // species min and max value of x axis
                      .domain([d3.min(years) - 2, d3.max(years)])
                      // calculates the spacing and width based on the 
                      // domain and width of graph
                      .range([0, width]);


        var yScale = d3.scale.linear()
                      // y-axis min and max value
                      .domain([0, d3.max(populations)])
                      // has to be height first other wise it is negative
                      .range([height, 0]);

        var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient('bottom')
                      // sets the tick format
                      .tickFormat(function(data){ return data + "s"; })
                      .ticks(4)
                      .tickPadding(10);

        var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient('left')
                      .ticks(10);

        var tooltip = d3.select('body').select(target)
                        .select(".col-50")
                        .append('div')
                        .attr('class', 'tooltip')
                        .html(message)
                        .style('opacity', 0.85);

        // appends svg with axis margins in mind
        var svg = d3.select(target).append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                      .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");
        
        svg.append('g')
            .attr('class', 'x axis')
            // moves tick value to center of bar
            .attr('transform', 'translate(' + barWidth / 2 + ', ' + height + ")")
            .call(xAxis);

        // rotates the label and other tick values
        svg.append('g')
              .attr('class', 'y axis')
              .call(yAxis)
            .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 10)
              .attr('x', 10)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Population');
        // todo fix bar padding between each value 
        svg.selectAll('.bar')
            .data(dataset)
            .enter()
            .append('rect')
              .attr('class', 'bar')
              .attr('x', function(d){ return xScale(d.era); })
              .attr('width', barWidth)
              .attr('y', function(d){ return yScale(d.pop); })
              .attr('height', function(d){ return height - yScale(d.pop); })
            .on('mouseover', function(d){
              // tooltip.transition()
              //   .duration(500)
              //   .style('opacity', '.85');
              tooltip.html('<b>' + title + ' <br />' + d.pop + "</b>");
                // .style('left', 95 + xScale(d.era) + "px")
                // .style('top', 120 + 28 + "px");  
            })
            .on('mouseout', function(d){
              // tooltip.transition()
              //   .duration(300)
              //   .style('opacity', 0);
              tooltip.html(message);
            });
      };  
    },
    link: function($scope) {
      $scope.$on('dataReady', function(event, data){
        $scope.createPopulationBar({
          data: $scope.allData, 
          title: $scope.title, 
          key: $scope.key,
          target: $scope.target
        }); 
      }); 
    }      
  };

});