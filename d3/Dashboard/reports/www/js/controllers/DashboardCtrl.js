app.controller('DashboardCtrl', [
  '$scope',
  'Population',
  function($scope, Population) {

    // http://www.census.gov/popest/data/metro/totals/2014/files/CSA-EST2014-alldata.pdf
    d3.csv("http://www.census.gov/popest/data/metro/totals/2014/files/CSA-EST2014-alldata.csv", function(error, data){
      console.log(data);
    }); 

    // http://www.census.gov/popest/data/national/totals/2014/files/NST-EST2014-popchg2010-2014.pdf
    d3.csv("http://www.census.gov/popest/data/national/totals/2014/files/NST-EST2014-popchg2010_2014.csv", function(error, data){
      console.log(data);
    }); 
    

    $scope.allData = [];
    Population.init();
    
  }
]);