// This directive is a new version of the legacy advanced option plugin
// made by Drew Samsen
//
// Parameters:
//
// resource        a ng-resource object in string version "Playlists" for example
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


angular.module('sampleApp').directive("selectionTool", ["appService", "$injector", "parseList", function (appService, $injector, parseList) {

  return {
    restrict: "A",
    templateUrl: "selectionTool.html",
    scope: {
      directId: "@",
      resource: "=",
      data: "=",
      resource_name: "=resourceName",
      start_closed: "@startClosed",
      pre_selected: "=preSelected",
      pre_selected_id: "=preSelectedId",
      create: "=",
      init_compact: "=initCompact",
      ngModel: "=",
      resourceModel: "@",
      add: "=",
      remove: "=",
      update: "=",
      multiple: "=",
      sort: "=",
      ajax_search: "@ajaxSearch",
      displayAttr: "@",
      minimized: "@",
      compact: "@",
      filterParams: "=filterParams",
      nameAttr: "@nameAttr",
      idAttr: "@idAttr",
      preview: "="
    },
    require: '^ngModel',

    controller: function($scope) {
      // Initialization and Watch Setup // 
      $scope.single_lock = false;
      $scope.multiple_status = true;
      $scope.ngModel = {};
      $scope.select_data = [];
      $scope.selected_data = [];

      ["multiple", "minimized", "start_closed"].forEach(function(attr){
        $scope[attr] = ([undefined, "false", null].indexOf($scope.multiple) !== -1) ? false : $scope[attr];        
      });
      
      $scope.output = ($scope.nameAttr == undefined) ? "name" : $scope.nameAttr;
      $scope.id = ($scope.idAttr == undefined) ? "id" : $scope.idAttr;
      $scope.compact = ([undefined, "false"].indexOf($scope.init_compact)) == -1 ? false : angular.copy($scope.init_compact);

      // allow passing in filters if nothing then default
      $scope = appService.determine_filter($scope);

      if ($scope.directId == undefined) {
        $scope.$on($scope.directId + "_reload_selection_tool", function(event, data) {
          $scope.load_resource_data();
        });
      }

      // listen for changes in filters and do more actions
      $scope.$watch("filters", function(newValue){
        $scope.selected_data = [];
        $scope.check_multiple_status();
        $scope.load_resource_data();
      });

      // allow for ajax searching for new data, merge selected data to newly found results
      if ($scope.ajax_search !== undefined && $scope.selected_data !== undefined) {
        $scope.$watch("search", function(data) {
          var params = angular.extend($scope.filters, {
            "query": data
          });
          return $injector.get($scope.resource).query(params, function(result) {
            $scope.select_data = result[$scope.resourceModel.toLowerCase()];
            return $scope.filter_out_selected();
          });
        });
      }

      // listen for preloaded set of data, it can come as a promise
      $scope.$watch("data", function(data) {
        if (data !== undefined) {
          $scope.select_data = data;
          if ($scope.pre_selected === undefined) {
            $scope.initial_filter_selected();
            return $scope.find_pre_select_id();
          }
        }
      });

      // listen for preselected data to come in, it can come as a promise
      $scope.$watch("pre_selected", function(data) {
        if ($scope.pre_selected !== undefined) {
          $scope.selected_data = angular.copy($scope.pre_selected);
          return $scope.filter_out_selected();
        }
      });
    

      // UI Change Events Handle  //
      $scope.react_compact = function() {
        console.log($scope.compact);
        if ($scope.compact === true || $scope.minimized) {
          $(".preview-icon").css("left", "303px");
        } else {
          $(".preview-icon").css("left", "280px");
        }
      };
      
      // minimizes the directive into one level, future implement for maximize
      $scope.minimize = function() {
        $scope.compact = !$scope.compact;
        $scope.react_compact();
      };

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


  // Loading Functionality //
      
      $scope.find_pre_select_id = function() {
        $scope.$watch("pre_selected_id", function(data) {
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
            model = _.pluralize(appService.camelcase($scope.resource));
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
        return $scope.$watch("pre_selected_id", function(data) {
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
            model = _.pluralize(homeService.camelcase($scope.resource));
            $scope.select_data = data[model];
            if ($scope.selected_data.length > 0) {
              $scope.init_remove_selected_items();
            }
            return $scope.find_pre_select_id();
          });
        }
      };
    };

  // End Controller //

    link: function(scope, element, attrs) {
      scope.load_resource_data();
      scope.react_compact();

      // listen for the element to setup then apply angular style form validation
      // and checking based on dirty, pristine status changes
      scope.$watch(function() {
        return element.attr('class');
      }, function(newValue) {
        if (element.attr("required") === "required" && scope.init === void 0) {
          element.removeClass("ng-valid-required").addClass("ng-invalid-required");
          element.removeClass("ng-valid").addClass("ng-invalid");
          scope.required = true;
          scope.init = true;
        }
        scope.$on("advanced-option-changed", function(event) {
          element.removeClass("ng-pristine").addClass("ng-dirty");
          element.closest("form").removeClass("ng-pristine").addClass("ng-dirty");
          if (scope.required && scope.selected_data.length === 0) {
            element.removeClass("ng-valid-required").removeClass("ng-valid");
            return element.addClass("ng-invalid").addClass("ng-invalid-required").addClass("error");
          } else {
            element.addClass("ng-valid").addClass("ng-valid-required").removeClass("error");
            return element.removeClass("ng-invalid-required").removeClass("ng-invalid");
          }
        });
      });
    };

}]);
