app.factory('PopulationHistory', [
  '$q',
  function($q) {

    var states = {},
        dates = {},
        minPopulation = 0,
        maxPopulation = 0;

    function addDateToState(data) {
      var state = data.state;
      if (!data.population) {
        data.population = 0;
      } else {
        data.population = parseInt(data.population);
      }

      data.year = parseInt(data.year);

      if (!states[state]) {
        states[state] = [];
      }
      states[state].push(data);
    }

    function addDateToList(data) {
      var year = data.year;
      if (!dates[year]) {
        dates[year] = true;
      }
    }

    function determineMaxMinPop(data) {
      var population = parseInt(data.population);
      if (population > maxPopulation) {
        maxPopulation = population;
      } else if (population < minPopulation) {
        minPopulation = population;
      }

      if (minPopulation == 0) {
        minPopulation = population;
      }

      console.log(minPopulation);
    }

    function parseData(data) {
      for (var i = 0; i < data.length; i++) {
        addDateToState(data[i]);
        addDateToList(data[i]);
        determineMaxMinPop(data[i]);
      }
    }

    return {
      states: states,
      dates: dates,
      maxPopulation: maxPopulation,
      minPopulation: minPopulation,
      init: function() {
        var deferred = $q.defer();
        d3.json('js/population/population_history.json', function(error, data){
          parseData(data);
          deferred.resolve();
        });
        return deferred.promise;
      }      
    }

  }
]);