"use strict";

angular.module("core").factory("regexService", [function() {

    // extend applicationService which returns an object
    var methods = {};

    // returns the types available for format
    methods["item_types"] = function(format) {
      var output = {};
      var types = {
        "html_snippet": {format: "display", text: "HTML Snippet"},
        "iframe": {format: "display", text: "Iframe"},
        "vast_url": {format: "video", text: "Vast URL"}
      };
      Object.keys(types).forEach(function(key){
        if (types[key]["format"] === format && key !== "not_allowed") {
          output[key] = types[key]["text"];
        }
      });
      return output;
    };

    // return keys based on type
    methods["keys"] = function() {
      return {
        video: {
          color: "color",
          yes: "yes",
          volume: "volume",
          system: "system",
          blue: "blue"
        },
        display: {
          frame: "frame",
          mat: "mat",
          glass: "glass"
        }
      };
    };

    // match to see if key is already added 
    methods["already_added_keys"] = function(added_keys, key) {
      if (added_keys.indexOf(key) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    // add an empty row with template filled at the end of text
    methods["add_empty_key"] = function($scope, options) {
      var duplicate;
      if (options == null) {
        options = {first: false};
      }

      // match for duplicates - do not add if it is a duplicate
      duplicate = $scope.base === "&__TEMPLATE[]__" || $scope.base === "&[]";
      
      if (options.first && duplicate) {
        $scope.base = "";
        $scope.highlighted = "";
      }
      
      // add template and highlight
      if ($scope.format === "video") {
        $scope.base += "&__TEMPLATE[]__";
        $scope.highlighted += "&\<\i class\=\"item-key\"\>\_\_TEMPLATE\[\]\_\_\<\/\i\>";
      } else {
        $scope.base += "&[]";
        $scope.highlighted += "&\<\i class\=\"item-key\"\>\[\]\<\/\i\>";
      }
      if ($scope.sr !== void 0) {
        $scope.sr.item.highlighted = $scope.base;
      }
      return $scope;
    };

    // try to match for key template
    methods["key_matched"] = function($scope, key) {
      if ($scope.format === "video") {
        return $scope.base.match(new RegExp("\\_\\_TEMPLATE\\[" + key + "\\]\\_\\_"));
      } else {
        return $scope.base.match(new RegExp("\\[" + key + "\\]"));
      }
    };

    // match and return regex for the old value to be replaced
    methods["old_key_regex"] = function($scope, item) {
      if (item == null) {
        item = {
          old_value: ""
        };
      }
      if ($scope.format === "video" && $scope.base !== void 0) {
        if (item.old_value !== "") {
          return "\_\_TEMPLATE\[" + item.old_value + "\]\_\_";
        }
        return "\_\_TEMPLATE\[\]\_\_";
      } else if ($scope.format === "display" && $scope.base !== void 0) {
        if (item.old_value !== "") {
          return "\[" + item.old_value + "\]";
        }
        return "\[\]";
      }
    };

    // match and return replacement value regex
    methods["new_key_regex"] = function($scope, key) {
      if ($scope.format === "video") {
        return "__TEMPLATE[" + key + "]__";
      } else if ($scope.format === "display") {
        return "[" + key + "]";
      }
    };

    // match and return old highlighted regex for old value
    methods["old_ad_key_regex"] = function($scope, item) {
      if (item == null) {
        item = {
          old_value: ""
        };
      }
      if ($scope.format === "video") {
        if (item.old_value !== "") {
          return "\<i class=\"item-key\"\>\_\_TEMPLATE\[" + item.old_value + "\]\_\_\<\/i\>";
        }
        return "\<i class=\"item-key\"\>\_\_TEMPLATE\[\]\_\_\<\/i\>";
      } else if ($scope.format === "display") {
        if (item.old_value !== "") {
          return "\<i class=\"item-key\"\>\[" + item.old_value + "\]\<\/i\>";
        }
        return "\<i class=\"item-key\"\>\[\]\<\/i\>";
      }
    };

    // return regex for highlighted regex for new key
    methods["new_ad_key_regex"] = function($scope, key) {
      if ($scope.format === "video") {
        return "\<i class=\"item-key\"\>\_\_TEMPLATE\[" + key + "\]\_\_\<\/i\>";
      } else if ($scope.format === "display") {
        return "\<i class=\"item-key\"\>\[" + key + "\]\<\/i\>";
      }
    };


    // updates key borders when new key is selected
    methods["update_bordered_keys"] = function($scope, keys, key) {
      var $bordered_key, count, key_reg_exp;
      key_reg_exp = new RegExp("\\_\\_TEMPLATE\\[" + keys[key] + "\\]\\_\\_", "g");
      $bordered_key = "\<\i class\=\"item-key\"\>\_\_TEMPLATE\[" + key + "\]\_\_\<\/\i\>";
      if ($scope.format === "display") {
        key_reg_exp = new RegExp("\\[" + keys[key] + "\\]", "g");
        $bordered_key = "\<\i class\=\"item-key\"\>\[" + key + "\]\<\/\i\>";
      }
      if (methods.key_matched($scope, keys[key]) !== null) {
        count = $scope.key_results.length;
        $scope.key_results.push({
          key: keys[key],
          old_value: keys[key],
          row: count
        });
        $scope.added_keys.push(key);
        $scope.highlighted = $scope.highlighted.replace(key_reg_exp, $bordered_key);
      }
      return $scope;
    };

    // updates keys when base textarea changes
    methods["update_keys"] = function($scope) {
      var keys;
      $scope.base = $scope.base === null ? "" : $scope.base;
      $scope.highlighted = $scope.base;
      $scope.added_keys = [];
      $scope.key_results = [];
      $scope.key_text_change = true;
      keys = methods.keys()[$scope.format];
      $scope.highlighted = $scope.highlighted.replace(new RegExp(/<\//g), "&lt;");
      $scope.highlighted = $scope.highlighted.replace(new RegExp(/<\//g), "&lt;\/");
      Object.keys(keys).forEach(function(key) {
        return $scope = methods.update_bordered_keys($scope, keys, key);
      });
      if ($scope.added_keys.length === 0) {
        $scope.base = $scope.base.replace(new RegExp("&" + methods.old_key_regex($scope)), "");
        $scope.highlighted = $scope.base;
      }
      if ($scope.sr !== void 0) {
        $scope.sr.item.highlighted = $scope.base;
      }
      return $scope;
    };

    // adds a new key
    methods["add_new_key"] = function($scope) {
      var count;
      count = $scope.key_results.length;
      $scope.key_results.push({
        key: "",
        old_value: "",
        row: count
      });
      $scope = methods.add_empty_key($scope);
      return $scope;
    };

    // removes keys in the base based on regex
    methods["remove_base_regex"] = function($scope, key, options) {
      if (options == null) {
        options = {
          single: false
        };
      }
      if ($scope.format === "video") {
        if (options.single === false) {
          $scope.base = $scope.base.replace(new RegExp("&\\_\\_TEMPLATE\\[" + key + "\\]\\_\\_", "g"), "");
        }
        $scope.base = $scope.base.replace(new RegExp("\\_\\_TEMPLATE\\[" + key + "\\]\\_\\_", "g"), "");
        $scope.highlighted = $scope.highlighted.replace(new RegExp("&\<i class=\"item-key\"\>\_\_TEMPLATE\\[" + key + "\\]\_\_\<\/i\>", "g"), "");
        $scope.highlighted = $scope.highlighted.replace(new RegExp("\<i class=\"item-key\"\>\_\_TEMPLATE\\[" + key + "\\]\_\_\<\/i\>", "g"), "");
        return true;
      } else {
        if (options.single === false) {
          $scope.base = $scope.base.replace(new RegExp("&\\[" + key + "\\]", "g"), "");
        }
        $scope.base = $scope.base.replace(new RegExp("\\[" + key + "\\]", "g"), "");
        $scope.highlighted = $scope.highlighted.replace(new RegExp("&\<i class=\"item-key\"\>\\[" + key + "\\]\<\/i\>", "g"), "");
        $scope.highlighted = $scope.highlighted.replace(new RegExp("\<i class=\"item-key\"\>\\[" + key + "\\]\<\/i\>", "g"), "");
        return true;
      }
    };

    // removes multiple matching keys
    methods["remove_matching_keys"] = function($scope, key) {
      var difference, match;
      difference = [];
      match = $scope.base.match(new RegExp(key));
      $scope.key_results.forEach(function(item) {
        if (item.key !== key) {
          return difference.push(item);
        }
      });
      $scope.key_results = difference;
      return $scope;
    };

    // remove individual key calls the other two remove methods for further actions
    methods["remove_key"] = function($scope, key, count) {
      if ($scope.key_results.length !== 1) {
        $scope.key_results.forEach(function(item) {
          if (item.key === key) {
            methods.remove_base_regex($scope, item.key);
            $scope = methods.remove_matching_keys($scope, key);
            if ($scope.key_results.length === 0) {
              return $scope.key_results = [];
            }
          }
        });
      } else {
        key = $scope.key_results[0].key;
        methods.remove_base_regex($scope, key, {
          single: false
        });
        $scope.key_results = [];
      }
      return $scope;
    };

    methods["focus_key"] = function($event) {
      $($event.target).select();
      return true;
    };

    methods["camelcase"] = function(input) {
      return input.toLowerCase().replace(" ", "_");
    };

    
    return methods;
  }
]);
