'use strict';

angular.module('core').directive('slider', [

  function(){

    return {
      scope: {
        timeout: '@',
        items: '='
      },
      templateUrl: 'modules/core/directives/slider.html',
      restrict: 'AC',
      controller: function($scope){

        $scope.timeOut = ($scope.timeout !== undefined) ? $scope.timeout : 4000;
        $scope.timeOutFn   = null;
        $scope.faderStat   = true;
        $scope.mOver       = false;


        $scope.$watch('current', function(newValue){
          if(newValue !== undefined){
            $scope.items.forEach(function(image){
              image.visible = false;
            });
            $scope.items[newValue].visible = true;
          }
        });
        
        $scope.setCurrentSlide = function(index){
          $scope.current = index;
        };

        $scope.isCurrentIndex = function(index){
          $scope.current = index;
        };

        $scope.prevSlide = function(){
          $scope.current = ($scope.current == 0) ? $scope.items.length - 1 : $scope.current - 1;
        };

        $scope.nextSlide = function(){
          $scope.current = ($scope.current < $scope.items.length - 1) ? $scope.current + 1 : 0;
        };       


      },
      link: function(scope, element, attrs){
        scope.setCurrentSlide(0);
      }
    };


  }

]);