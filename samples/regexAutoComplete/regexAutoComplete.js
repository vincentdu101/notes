angular.module('sampleApp').directive("regexAutocomplete", [
  "regexService", function(regexService) {
    return {
      // setup for directive
      restrict: "A",
      templateUrl: asset_path("regexAutoComplete.html"),
      require: "^ngModel",
      scope: {
        item: "=",
        format: "=",
        type: "=",
        base: "=",
        ngModel: "="
      },
      controller: function($scope) {
        // make helper methods available in template view
        $scope.helpers = regexService;

        // copy in order to prevent data binding
        $scope.original_format = angular.copy($scope.format);
        $scope.added_keys = [];

        // pre load keys based on format 
        $scope.types = regexService.item_types($scope.original_format);
        $scope.first_key = Object.keys($scope.types)[0];
        $scope.keys = regexService.keys()[$scope.format];
        if ($scope.base === undefined) {
          $scope.base = "";
        }
        $scope.highlighted = "";

        // controls the select dropdowns and key textarea output in template view
        $scope.key_results = [
          {
            key: "",
            old_value: "",
            row: 0
          }
        ];

        $scope = regexService.add_empty_key($scope, {
          first: true
        });

        $scope.support_data = {
          single: true
        };

        // watch for format change in controller and perform additional task
        // other than having it be assigned
        $scope.$watch("format", function(new_data) {
          var first_key;
          if ($scope.original_format !== new_data) {
            // reloads available keys
            $scope.types = regexService.item_types($scope.format);
            first_key = Object.keys($scope.types)[0];
            $scope.item.item_type = $scope.types[first_key];
            $scope.type = first_key;

            // updates textarea on changes to try to pick new matching keys
            $scope = regexService.update_keys($scope);
            $scope.original_format = new_data;
          }
        });

        $scope.change_item_type = function(type) {
          return $scope.type = type.toLowerCase().replace(new RegExp(" ", "g"), "_");
        };

        // listens for user changes to the chosen key select and matches using regex
        $scope.determine_output_results = function(key, row) {
          $scope.key_results.forEach(function(item) {
            var new_ad_key_reg, new_key_reg, old_ad_key_reg, old_key_reg;
            if (item.row === row) {
              // matches base for keys and replaces the template base with new selected key
              old_key_reg = regexService.old_key_regex($scope, item);
              new_key_reg = regexService.new_key_regex($scope, key);
              $scope.base = $scope.base.replace(old_key_reg, new_key_reg);

              // replaces highlighted textarea to match base changes and adds highlighting
              old_ad_key_reg = regexService.old_ad_key_regex($scope, item);
              new_ad_key_reg = regexService.new_ad_key_regex($scope, key);
              $scope.highlighted = $scope.highlighted.replace(old_ad_key_reg, new_ad_key_reg);
              
              // replaces old value of row, old value is necessary in order to match for 
              // with new key replacement
              $scope.key_results[row].old_value = key;
              $scope.key_results[row].key = key;
              $scope.added_keys.push(key);
            }
          });
          if ($scope.sr !== undefined) {
            $scope.sr.item.highlighted = $scope.base;
          }
          $("form[name='newItemForm']").find("#item_base").val($scope.base);
        };

        $scope.update_keys = function(input) {
          $scope.base = input;
          return $scope = regexService.update_keys($scope);
        };

        $scope.add_new_key = function() {
          $scope = regexService.add_new_key($scope);
          $("form[name='newItemForm']").find("#item_base").val($scope.base);
        };

        $scope.remove_key = function(key, count) {
          $scope = regexService.remove_key($scope, key, count);
          $("form[name='newItemForm']").find("#item_base").val($scope.base);
        };
      }
    };
  }
]);
