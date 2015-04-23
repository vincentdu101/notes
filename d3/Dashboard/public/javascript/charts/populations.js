// dimensions of map
function drawMap(options) {
  var target = options.target;
  var w = 700;
  var h = 300;

  // scale map to fit
  var projection = d3.geo.albersUsa()
                    .translate([w/2, h/2])

                    // max number for determining scale ratio
                    .scale([500]);

  var path = d3.geo.path().projection(projection);

  var svg = d3.select('body').select(target).append('svg').attr({width: w, height: h});

  d3.json('javascript/us.json', function(json){
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', '#666666');
  });
}


function createPopulationBar(options) {
  var data = options.data;
  var title = options.title;
  var key = options.key;
  var target = options.target;
  var dataset = [];
  
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

  var tooltip = d3.select('body').select(target).append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

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
        tooltip.transition()
          .duration(500)
          .style('opacity', '.85');
        tooltip.html('<b>' + title + ' <br />' + d.pop + "</b>")
          .style('left', 95 + xScale(d.era) + "px")
          .style('top', 120 + 28 + "px");  
      })
      .on('mouseout', function(d){
        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });
}


d3.csv('javascript/youth_data/YA_1980_010.csv', function(error, eight){

  d3.csv('javascript/youth_data/YA_1990_010.csv', function(error, nine){

    d3.csv('javascript/youth_data/YA_2000_010.csv', function(error, ten){

      d3.csv('javascript/youth_data/YA_2009_2013_010.csv', function(error, eleven){
        var w = 700;
        var h = 300;
        var allData = [];

        console.log("1980s ", eight);
        console.log("1990s ", nine);
        console.log("2000s",  ten);
        console.log("2010s",  eleven);

        allData.push({era: 1980, data: eight[0]});
        allData.push({era: 1990, data: nine[0]});
        allData.push({era: 2000, data: ten[0]});
        allData.push({era: 2010, data: eleven[0]});

        drawMap({ target: '.map' });
        createPopulationBar({
          data: allData, 
          title: 'Populations', 
          key: 'population',
          target: '.bar'
        });
      });

    });

  });

});
  