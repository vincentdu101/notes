angular.module('sampleApp').controller("SampleNewCtrl", [
  "$scope", "regexService", "shareNav", 'Resource', function($scope, regexService, shareNav, Resource) {

    // initialize resource and helper methods extended from injected service
    $scope.resource = {};
    $scope.helpers = regexService;
    
    // get the pre-selected filter as preferred filter for view
    // it is saved in the root level because all other views can 
    // share the same selected format
    $scope.format = $scope.$root.format;

    // form filters the dropdown selection based on format
    if ($scope.format === "display") {
      $scope.resource_type = "html_snippet";
    } else {
      $scope.format = "video";
      $scope.resource_type = "vast_url";
    }

    $scope.change_format = function(type) {
      type = type.toLowerCase();
      return $scope.format = type;
    };

    // method called when form submits to collect various parts of the object
    // to be saved
    $scope.create_resource = function() {
      var resource;
      if ($scope.newresourceForm.$valid === true) {
        resource = $scope.resource;
        resource.resource_type = $scope.resource_type;
        resource["advertiser_id"] = $scope.advertisers[0].id;
        resource.width = resourcesService.splitString(resource.sizes.id, 0);
        resource.height = resourcesService.splitString(resource.sizes.id, 1);
        
        // API requires only valid keys so these misc. attributes have to be
        // deleted
        delete resource["format"];
        delete resource.advertiser;
        delete resource.sizes;
        if ($scope.$root.selected_resources_size !== 0) {
          resource["media_item_id"] = $scope.$root.selected_resources[0].id;
        }
        
        // Resource is a proxy wrapper service around the ng-resource service
        // we wrapped it in order to add in extra search params and other methods 
        // for every call by default
        Resource.create_resource($scope.resource, {
          callback: function(data) {
            // module to display flash messages and service to redirect user to specific url
            // I did not develop this so I did not include these 
            ViewUpdater.flashMessage("Successfully created resource \"" + data.resource.name + "\".", "success");
            shareNav.view_resource(data.resource.id);
          }
        });
      }
    };
  }
]);
