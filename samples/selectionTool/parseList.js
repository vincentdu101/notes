'use strict';

angular.module('core').factory('parseList', [
  '$rootScope', function($rootScope) {
    return {
      search_array_object: function(list, id, attr) {
        if (attr == null) {
          attr = 'id';
        }
        if (!(list === undefined || list.length === 0)) {
          list.forEach(function(item){
            if (parseInt(item[attr]) === id) {
              return [item];
            }
          });
        }
        return [];
      },

      camelcase: function(resource){
        var model = resource.replace(new RegExp(/(?=[A-Z])/g), '_').toLowerCase();
        model = (model[0] === '_') ? model.slice(1, model.length - 1) : model;
        return model;
      },

      determine_filter: function($scope){
        if ($scope.filterParams === undefined){
          $scope.filters = {};
        }
        else {
          $scope.filters = angular.extend($scope.filterParams, {});
        }
        return $scope;
      },

      // collect and return a list of ids from an array of resources
      filter_resource_ids: function(resources, id_attr) {
        var output = [];
        resources.forEach(function(item){ return output.push(item[id_attr]); });
        return output;      
      }

    };
  }
]);
