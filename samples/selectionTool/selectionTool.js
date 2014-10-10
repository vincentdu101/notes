// This directive is a new version of the legacy advanced option plugin
// made by Drew Samsen
//
// Parameters:
//
// resource        a ng-resource object in string version 'Playlists' for example
// data            an array of objects, either this or the resource param is allowed
// resource_name   title of resources passed in
// resource-model  attribute of ng-model that will be saved to
// ng-model        object saved to for use in form
// start_closed    start in minimized state
// compact         start in compact mode
// add             callback function for after each add, input just the function declaration
//                 and not the () or the (var), function must be declared in ctrl scope
// remove          same setup as add, but called when selection is removed
// update          same setup as add, but called whenever selection is added, removed, sorted
// preview         same setup as add, but called when preview icon is clicked     
//

'use strict';

angular.module('core').directive('selectionTool', ['$injector', 'parseList', function ($injector, parseList) {

  return {
    restrict: 'A',
    templateUrl: 'modules/core/directives/selectionTool.html',
    scope: {
      directId: '@',                        
      resource: '=',
      data: '=',
      resource_name: '=resourceName',
      start_closed: '@startClosed',
      pre_selected: '=preSelected',
      pre_selected_id: '=preSelectedId',
      create: '=',
      init_compact: '=initCompact',
      ngModel: '=',
      resourceModel: '@',
      add: '=',
      remove: '=',
      update: '=',
      multiple: '@',
      sort: '=',
      ajax_search: '@ajaxSearch',
      displayAttr: '@',
      minimized: '@',
      compact: '@',
      filterParams: '=filterParams',
      nameAttr: '@nameAttr',
      idAttr: '@idAttr',
      preview: '='
    },
    require: '^ngModel',

    controller: function($scope) {
      // Initialization and Watch Setup // 
      $scope.single_lock = false;
      $scope.multiple_status = true;
      $scope.ngModel = {};
      $scope.select_data = [];
      $scope.selected_data = [];

      ['multiple', 'minimized', 'start_closed'].forEach(function(attr){
        $scope[attr] = ([undefined, 'false', null].indexOf($scope[attr]) !== -1) ? false : $scope[attr];        
      });
      
      $scope.output = ($scope.nameAttr == undefined) ? 'name' : $scope.nameAttr;
      $scope.id = ($scope.idAttr == undefined) ? 'id' : $scope.idAttr;
      $scope.compact = ([undefined, 'false'].indexOf($scope.init_compact)) == -1 ? false : angular.copy($scope.init_compact);

      // allow passing in filters if nothing then default
      // $scope = parseList.determine_filter($scope);

      if ($scope.directId == undefined) {
        $scope.$on($scope.directId + '_reload_selection_tool', function(event, data) {
          $scope.load_resource_data();
        });
      }

      // listen for changes in filters and do more actions
      $scope.$watch('filters', function(newValue){
        $scope.selected_data = [];
        $scope.check_multiple_status();
        $scope.load_resource_data();
      });

      // allow for ajax searching for new data, merge selected data to newly found results
      if ($scope.ajax_search !== undefined && $scope.selected_data !== undefined) {
        $scope.$watch('search', function(data) {
          var params = angular.extend($scope.filters, {
            'query': data
          });
          return $injector.get($scope.resource).query(params, function(result) {
            $scope.select_data = result[$scope.resourceModel.toLowerCase()];
            return $scope.filter_out_selected();
          });
        });
      }

      // listen for preloaded set of data, it can come as a promise
      $scope.$watch('data', function(data) {
        if (data !== undefined) {
          $scope.select_data = data;
          if ($scope.pre_selected === undefined) {
            $scope.initial_filter_selected();
            return $scope.find_pre_select_id();
          }
        }
      });

      // listen for preselected data to come in, it can come as a promise
      $scope.$watch('pre_selected', function(data) {
        if ($scope.pre_selected !== undefined) {
          $scope.selected_data = angular.copy($scope.pre_selected);
          return $scope.filter_out_selected();
        }
      });
    
      $scope.update_ng_model = function() {
        $scope.ngModel[$scope.resourceModel] = $scope.selected_data;    
      }

      // UI Change Events Handle  //
      $scope.react_compact = function() {
        if ($scope.compact === true || $scope.minimized) {
          $('.preview-icon').css('left', '303px');
        } else {
          $('.preview-icon').css('left', '280px');
        }
      };
      
      // minimizes the directive into one level, future implement for maximize
      $scope.minimize = function() {
        $scope.compact = !$scope.compact;
        $scope.react_compact();
      };


      $scope.check_multiple_status = function(){
        $scope.single_lock = ($scope.selected_data.length === 1) ? true : false;
      }

      $scope.unminimize = function() {
        $scope.minimized = false;
        $scope.compact = true;
      };

      // called when ui-sortable directive is sorted
      $scope.sortable_events = {
        update: function(e, ui) {
          if ($scope.sort !== undefined) {
            return $scope.swap_original = ui.item.scope().$index;
          }
        },
        stop: function(e, ui) {
          if ($scope.update !== undefined) {
            $scope.update($scope.ngModel);
          }
          if ($scope.sort !== undefined) {
            return $scope.sort($scope.selected_data);
          }
        }
      };

      $scope.toggle_advance_visibility = function() {
        return $scope.start_closed = !$scope.start_closed;
      };

      $scope.initial_filter_selected = function() {
        $scope.selected_data.forEach(function(item){ $scope.add_resource(item[$scope.id]) });
        $scope.update_ng_model();
      };


  // Loading Functionality //
      
      $scope.find_pre_select_id = function() {
        $scope.$watch('pre_selected_id', function(data) {
          if ($scope.pre_selected_id !== undefined) {
            if (angular.isArray($scope.pre_selected_id) === false) {

              // parse lists for matching objects
              selected_found = parseList.search_array_object($scope.select_data, $scope.pre_selected_id, $scope.id);
              if (selected_found.length > 0) {
                $scope.selected_data = selected_found;
                $scope.filter_out_selected();
                return $scope.check_multiple_status();
              }
            } else {
              $scope.select_data.forEach(function(item){
                if ($scope.pre_selected_id.indexOf(item[$scope.id]) !== -1) {
                  $scope.selected_data.push(item);
                }
              });
              return $scope.filter_out_selected();
            }
          }
        });
      };

      $scope.load_resource_data = function() {
        var resource;
        if ($scope.data === undefined && $scope.resource !== undefined) {
          resource = $injector.get($scope.resource);
          return resource.query($scope.filters, function(data) {
            var model;
            // uses lodash method
            model = _.pluralize(parseList.camelcase($scope.resource));
            $scope.select_data = data[model];
            if ($scope.selected_data.length > 0) {
              $scope.init_remove_selected_items();
            }
            return $scope.find_pre_select_id();
          });
        }
      };


    // Parsing Functionality //
        // filter out already selected data from the overall list of resources
      $scope.find_pre_select_id = function() {
        return $scope.$watch('pre_selected_id', function(data) {
          if ($scope.pre_selected_id !== undefined) {
            if (angular.isArray($scope.pre_selected_id) === false) {
              selected_found = parseList.search_array_object($scope.select_data, $scope.pre_selected_id, $scope.id);
              if (selected_found.length > 0) {
                $scope.selected_data = selected_found;
                $scope.filter_out_selected();
                return $scope.check_multiple_status();
              }
            } else {
              $scope.select_data.forEach(function(item){
                if ($scope.pre_selected_id.indexOf(item[$scope.id]) !== -1) {
                  $scope.selected_data.push(item);
                }
              });
              return $scope.filter_out_selected();
            }
          }
        });
      };

      // loads using $injector to load ng-resource service based on name
      $scope.load_resource_data = function() {
        var resource;
        if ($scope.data === undefined && $scope.resource !== undefined) {
          resource = $injector.get($scope.resource);
          return resource.query($scope.filters, function(data) {
            var model;
            model = _.pluralize(parseList.camelcase($scope.resource));
            $scope.select_data = data[model];
            if ($scope.selected_data.length > 0) {
              $scope.init_remove_selected_items();
            }
            return $scope.find_pre_select_id();
          });
        }
      };

      // Parsing Functionality
      // filter out already selected data from the overall list of resources
      $scope.filter_out_selected = function() {
        if ($scope.select_data !== undefined || $scope.select_data.length === 0)
          var resources = $scope.select_data;
          $scope.select_data = [];
          var ids = parseList.filter_resource_ids($scope.selected_data, $scope.id);
          resources.forEach(function(item){
            if ($scope.selected_data !== undefined && $.inArray(item[$scope.id], ids) === -1)
              $scope.select_data.push(item);
          });
      };

      $scope.check_multiple_status = function(){
        $scope.single_lock = ($scope.selected_data.length === 1) ? true : false;
      };


      $scope.update_ng_model = function(){
        $scope.ngModel[$scope.resourceModel] = $scope.selected_data;
      };


      $scope.init_remove_selected_items = function() {
        if ($scope.select_data.length !== 0){
          output = [];
          ids = parseList.filter_resource_ids($scope.selected_data, "id");
          $scope.select_data.forEach(function(item){
            if (ids.indexOf(item[$scope.id]) === -1)
              output.push(item);
          });
          $scope.select_data = output;
        }
      };

      $scope.initial_filter_selected = function(){
        $scope.selected_data.forEach(function(item){ $scope.add_resource(item[$scope.id]); });
        $scope.update_ng_model();
      };

      // determines based on id what list needs to get the object based on its selection
      $scope.parse_input = function(input, output, id) {
        var selected;
        selected = _.filter($scope[input], function(item) {
          return item[$scope.id] === id;
        })[0];
        $scope[input] = _.reject($scope[input], function(item) {
          return item[$scope.id] === id;
        });
        $scope[output].push(selected);
        $scope.update_ng_model();
        if ($.inArray($scope.$root.$$phase, ["$digest", "$apply"]) === -1) {
          $scope.$apply();
        }
        if ($scope.multiple_status === false) {
          $scope.check_multiple_status();
        }
        $scope.$broadcast("advanced-option-changed");
        return selected;
      };

      $scope.add_resource = function(id) {
        var selected;
        selected = $scope.parse_input("select_data", "selected_data", id);
        if ($scope.add !== void 0) {
          $scope.add(selected);
        }
        if ($scope.update !== void 0) {
          return $scope.update($scope.selected_data);
        }
      };

      $scope.remove_resource = function(id) {
        var selected;
        selected = $scope.parse_input("selected_data", "select_data", id);
        if ($scope.remove !== void 0) {
          $scope.remove(selected, $scope.selected_data);
        }
        if ($scope.update !== void 0) {
          return $scope.update($scope.selected_data);
        }
      };

      $scope.delete_resource = function() {
        if ($scope.destroy !== void 0) {
          return $scope.destroy($scope.selected_data);
        }
      };

      $scope.add_all = function() {
        if ($scope.select_data !== void 0) {
          $scope.select_data.forEach(function(item) {
            return $scope.selected_data.push(item);
          });
          $scope.update_ng_model();
          $scope.select_data = [];
          if ($scope.update !== void 0) {
            return $scope.update($scope.selected_data);
          }
        }
      };

      $scope.remove_all = function() {
        if ($scope.selected_data !== void 0) {
          $scope.selected_data.forEach(function(item) {
            if ($scope.select_data === void 0) {
              $scope.select_data = [];
            }
            return $scope.select_data.push(item);
          });
          $scope.selected_data = [];
          $scope.update_ng_model();
          if ($scope.update !== void 0) {
            return $scope.update($scope.selected_data);
          }
        }
      };

      $scope.create_item = function() {
        if ($scope.create !== void 0) {
          return $scope.create($scope.new_item);
        }
      };      
    },
     

  // End Controller //

    link: function(scope, element, attrs) {
      // scope.load_resource_data();
      scope.react_compact();

      // listen for the element to setup then apply angular style form validation
      // and checking based on dirty, pristine status changes
      scope.$watch(function() {
        return element.attr('class');
      }, function(newValue) {
        if (element.attr('required') === 'required' && scope.init === void 0) {
          element.removeClass('ng-valid-required').addClass('ng-invalid-required');
          element.removeClass('ng-valid').addClass('ng-invalid');
          scope.required = true;
          scope.init = true;
        }
        scope.$on('advanced-option-changed', function(event) {
          element.removeClass('ng-pristine').addClass('ng-dirty');
          $("#" + element.id).closest('form').removeClass('ng-pristine').addClass('ng-dirty');
          if (scope.required && scope.selected_data.length === 0) {
            element.removeClass('ng-valid-required').removeClass('ng-valid');
            return element.addClass('ng-invalid').addClass('ng-invalid-required').addClass('error');
          } else {
            element.addClass('ng-valid').addClass('ng-valid-required').removeClass('error');
            return element.removeClass('ng-invalid-required').removeClass('ng-invalid');
          }
        });
      });
    }
  };
}]);
