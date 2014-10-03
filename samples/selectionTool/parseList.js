angular.module('sampleApp').factory("parseList", [
  "$rootScope", function($rootScope) {
    return {
      search_array_object: function(list, id, attr) {
        if (attr == null) {
          attr = "id";
        }
        if (!(list === undefined || list.length === 0)) {
          list.forEach(function(item){
            if (parseInt(item[attr]) === id) {
              return [item];
            }
          });
        }
        return [];
      }
    };
  }
]);
