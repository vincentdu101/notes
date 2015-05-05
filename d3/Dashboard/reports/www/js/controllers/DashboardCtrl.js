app.controller('DashboardCtrl', [
  '$scope',
  function($scope) {

    $scope.allData = [];

    d3.csv('js/youth_data/YA_1980_010.csv', function(error, eight){

      d3.csv('js/youth_data/YA_1990_010.csv', function(error, nine){

        d3.csv('js/youth_data/YA_2000_010.csv', function(error, ten){

          d3.csv('js/youth_data/YA_2009_2013_010.csv', function(error, eleven){
            var w = 700;
            var h = 300;
            var allData = [];

            console.log("1980s ", eight);
            console.log("1990s ", nine);
            console.log("2000s",  ten);
            console.log("2010s",  eleven);

            $scope.allData.push({era: 1980, data: eight[0]});
            $scope.allData.push({era: 1990, data: nine[0]});
            $scope.allData.push({era: 2000, data: ten[0]});
            $scope.allData.push({era: 2010, data: eleven[0]});

            $scope.$root.$broadcast('dataReady');
          });

        });

      });

    });
    
  }
]);