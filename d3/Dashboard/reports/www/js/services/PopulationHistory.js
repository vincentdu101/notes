app.factory('PopulationHistory', [
  '$q',
  function($q) {

    var states = {},
        dates = {};

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


    function parseData(data) {
      for (var i = 0; i < data.length; i++) {
        addDateToState(data[i]);
        addDateToList(data[i]);
      }
    }

    return {
      states: states,
      dates: dates,
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