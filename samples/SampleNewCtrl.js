angular.module('sampleApp').controller("SampleNewCtrl", [
  "$scope", "regexService", "navigation", 'parseList', 'Resource', function($scope, regexService, navigation, parseList, Resource) {

    // Slider Initialization
    // example of expected data input for slider
    $scope.slides = [
      {
        img: 'modules/core/img/slider/angularjs-logo.png',
        title: 'Angular.js',
        description: 'Using Angular methodologies I led the UI team to rebuild ' + 
          'two legacy UI systems from a Ruby on Rails full stack to an ' + 
          'Angular driven SPA front end with a Ruby on Rails Backend.'
      },
      {
        img: 'modules/core/img/slider/html5css3-logo.jpg',
        title: 'HTML5 and CSS3',
        description: 'I have used HTML and CSS for several years now and' + 
        ' have learned and applied new HTML5 and CSS3 concepts in my work.'
      },
      {
        img: 'modules/core/img/slider/sass-logo.jpg',
        title: 'SASS',
        description: 'Sass has been important in allowing for more efficient and ' + 
        'dynamic CSS design. Its concepts and foundations are heavily built on programming ' + 
        ' concepts and has been solved a number of CSS related issues like namespacing and redundancy.'
      },
      {
        img: 'modules/core/img/slider/rubyonrails-logo.png',
        title: 'Ruby on Rails',
        description: 'I have been using RoR for nearly two years now. It was the first ' + 
        'MVC framework that I used and it has been influential in my approaches and design. ' + 
        'I still regularly use it due to its effiency in rapid application prototyping.'
      },
      {
        img: 'modules/core/img/slider/node-logo.png',
        title: 'Node.js',
        description: 'Recently, I started learning and experiment with node. This app itself ' + 
        'utilizes the mean.js framework. I view Node as a major game changing technology that ' + 
        'is worth learning for the future.'
      }                  
    ];

    $scope.init_compact = true;

    // Selection Tool Initialization
    // example of expected data input for selectionTool
    $scope.languages = [
      {id: "angular", name: "Angular.js"},
      {id: "rubyonrails", name: "Ruby on Rails"},
      {id: "sass", name: "Sass"},
      {id: "html5css3", name: "HTML5 and CSS3"},
      {id: "node", name: "Node.js"},
      {id: "php", name: "PHP"},
      {id: "python", name: "Python"},
      {id: "java", name: "JAVA"},
      {id: "coldfusion", name: "ColdFusion"}
    ];

    $scope.preselected = [
      {id: "angular", name: "Angular.js"},
      {id: "rubyonrails", name: "Ruby on Rails"},
      {id: "sass", name: "Sass"},
      {id: "html5css3", name: "HTML5 and CSS3"},
      {id: "node", name: "Node.js"},
      {id: "php", name: "PHP"},
      {id: "java", name: "JAVA"}
    ];

    $scope.add_callback = function(item){
      $scope.selected.add = item;
    };

    $scope.remove_callback = function(item){
      $scope.selected.removed = item;
    };    

    $scope.sort_callback = function(item){
      $scope.selected.sorted = item;
    }

    $scope.resource_name = "Languages";

    // Regex AutoComplete Initialization
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

    $scope.highlighted = "";

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
        
      }
    };
  }
]);
