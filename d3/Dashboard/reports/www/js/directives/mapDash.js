app.directive('mapDash', [
  'Population',
  function(Population){

    return {
      restrict: "E",
      scope: {
        allData: "=",
        target: "@"
      },
      templateUrl: "templates/shared/mapDash.html",
      controller: function($scope) {

        $scope.target = $scope.target ? $scope.target : ".map-dash-target";
        $scope.currentRegion = Population.getRegionInfo("United States");

        function useFocusColor(feature) {
          if (feature) {
            d3.selectAll('path')
              .classed('selected', function(d, i){
                return d.id !== feature.id;
              });
          }
        }


        // dimensions of map
        function drawMap(options) {
          var target = options.target;
          var w = 750;
          var h = 350;

          // scale map to fit
          var projection = d3.geo.albersUsa()
                            .translate([w/2, h/2])

                            // max number for determining scale ratio
                            .scale([750]);

          var path = d3.geo.path().projection(projection);

          var svg = d3.select('body').select(target).append('svg').attr({width: w, height: h});

          var color = d3.scale.category10().domain(d3.range(9)),
              selectedColor = 2,
              dragColor = 1;

          var components = color.domain().map(function() { return []; });

          d3.json('js/us.json', function(error, us){
            
            var bisectId = d3.bisector(function(d){ return d.id; }).left;
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
              .style('stroke-capacity', 1)
              .selectAll('path')
                .data(features)
              .enter().append('path')
                .attr('d', function(d, i){ d.color = null; return path(d); })
                .attr('class', 'selected')
                .attr('data-id', function(d, i){ return d.id; })
                .on('mouseover', function(){ this.style.stroke = 'black'; })
                .on('mouseout', function(){ this.style.stroke = 'none'; })
                .call(d3.behavior.drag()
                  .on('dragstart', dragstart)
                  .on('drag', drag));

            // top.location.hash.split('').slice(1, features.length).forEach(function(c, i){
            //   if ((c = +c) >= 0 && c < 10) assign(features[i], c ? c - 1: null);
            // });

            redraw();

            function dragstart() {
              var feature = d3.event.sourceEvent.target.__data__;
              useFocusColor(feature);
              dragColor = feature.color === selectedColor ? 0 : selectedColor;
              console.log(feature);
              $scope.currentRegion = feature.properties.name; 
              $scope.$apply();           
              if (assign(feature, dragColor)) {
                redraw();
              }
              $scope.$root.$broadcast('selectState', {state: feature.properties.name});
            }

            function drag() {
              var feature = d3.event.sourceEvent.target.__data__;
              useFocusColor(feature);
              if (feature && assign(feature, dragColor)) {
                redraw();
              }
            }

            function assign(feature, color) {
              if (feature.color !== null) {
                var component = components[feature.color];
                component.splice(bisectId(component, feature.id), 0, feature);
                feature.color = color;
              }
              if (color !== null) {
                var component = components[color];
                component.splice(bisectId(component, feature.id), 0, feature);
                feature.color = color;
              }
              return true;
            }

            function redraw() {
              merge.data(components).attr('d', function(d){ 
                return path({type: 'FeatureCollection', features: d}) || "M0,0"; });
              // stores colors history in url, not needed but interesting reference
              // top.history.replaceState(null, null, "#" + features.map(function(d){ return d.color === null ? "0": d.color + 1; }).join(""));
            }

          });
        }
        drawMap({target: $scope.target});
      }
    }

  }
]);