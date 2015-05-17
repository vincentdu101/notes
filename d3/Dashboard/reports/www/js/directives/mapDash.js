app.directive('mapDash', function(){

  return {
    restrict: "E",
    scope: {
      allData: "=",
      target: "@"
    },
    templateUrl: "templates/shared/mapDash.html",
    controller: function($scope) {

      $scope.target = $scope.target ? $scope.target : ".map-dash-target";

      // dimensions of map
      function drawMap(options) {
        var target = options.target;
        var w = 800;
        var h = 400;

        // scale map to fit
        var projection = d3.geo.albersUsa()
                          .translate([w/2, h/2])

                          // max number for determining scale ratio
                          .scale([500]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select('body').select(target).append('svg').attr({width: w, height: h});

        var color = d3.scale.category10().domain(d3.range(9)),
            selectedColor = 0,
            dragColor;

        var components = color.domain().map(function() { return []; });

        d3.json('js/us.json', function(error, us){
          console.log(us);
          var features = topojson.feature(us, us.objects.states).features;

          svg.append('path')
            .datum(topojson.mesh(us, us.objects.states))
            .attr('class', 'background')
            .attr('d', path);

          var merge = svg.append('g')
            .attr('class', 'merge')
            .selectAll('path')
            .data(components)
            .enter().append('path')
              .style('fill', function(d, i){ return color(i); })
              .style('stroke', function(d, i){ return d3.lab(color(i)).darker(); });

          svg.append('g')
            .attr('class', 'foreground')
            .style('cursor', 'pointer')
            .style('stroke-capacity', .5)
            .selectAll('path')
              .data(features)
            .enter().append('path')
              .attr('d', function(d){ d.color = null; return path(d); })
              .on('mouseover', function(){ this.style.stroke = 'black'; })
              .on('mouseout', function(){ this.style.stroke = 'none'; })
              .call(d3.behavior.drag()
                .on('dragstart', dragstart)
                .on('drag', drag));

          top.location.hash.split('').slice(1, features.length).forEach(function(c, i){
            if ((c = +c) >= 0 && c < 10) assign(features[i], c ? c - 1: null);
          });

          redraw();

          function dragstart() {
            var feature = d3.event.sourceEvent.target.__data__;
             dragColor = feature.color === selectedColor ? null : selectedColor;
            if (assign(feature, dragColor)) {
              redraw();
            }
          }

          function drag() {
            var feature = d3.event.sourceEvent.target.__data__;
            if (feature && assign(feature, dragColor)) {
              redraw();
            }
          }

          function 

        });
      }
      drawMap({target: $scope.target});
    }
  }

});