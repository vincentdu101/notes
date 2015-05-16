app.factory('Population', [
  '$q',
  '$rootScope',
  '$http',
  function($q, $rootScope, $http){

    var allData = {};

    function parsePopulationData(data) {
      for (var i = 0; i < data.length; i++) {
        allData[data[i].NAME] = data[i];
      }
      console.log(allData);
    }

    return {

      getKeys: function() {
        return $http.get("js/category.json");
      },

      init: function() {
        var deferred = $q.defer();
        // http://www.census.gov/popest/data/metro/totals/2014/files/CSA-EST2014-alldata.pdf
        // d3.csv("js/population/population_info.csv", function(error, data){
        //   var allData = parseData(data);
        //   $rootScope.$broadcast('dataReady', {allData: allData});
        // }); 

        // http://www.census.gov/popest/data/national/totals/2014/files/NST-EST2014-popchg2010-2014.pdf
        // // http://www.census.gov/popest/data/national/totals/2014/files/NST-EST2014-popchg2010-2014.pdf
        d3.csv("js/population/population_estimate.csv", function(error, data){
          parsePopulationData(data);
          deferred.resolve({allData: allData});
        }); 
        return deferred.promise;        
      }

    };

  }
]);