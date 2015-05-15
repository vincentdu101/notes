app.factory('Population', [
  '$q',
  '$rootScope',
  '$http',
  function($q, $rootScope, $http){

    var allData = [];

    return {

      getKeys: function() {
        return $http.get("js/category.json");
      },

      init: function() {

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

                allData.push({era: 1980, data: eight[0]});
                allData.push({era: 1990, data: nine[0]});
                allData.push({era: 2000, data: ten[0]});
                allData.push({era: 2010, data: eleven[0]});

                $rootScope.$broadcast('dataReady', {allData: allData});
              });

            });

          });

        });
      }

    };

  }
]);