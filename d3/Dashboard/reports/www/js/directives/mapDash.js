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
        var w = 700;
        var h = 300;

        // scale map to fit
        var projection = d3.geo.albersUsa()
                          .translate([w/2, h/2])

                          // max number for determining scale ratio
                          .scale([500]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select('body').select(target).append('svg').attr({width: w, height: h});

        d3.json('js/us.json', function(json){
          svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#666666');
        });
      }
      drawMap({target: $scope.target});
    }
  }

});