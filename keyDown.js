// <input type="text" ng-keydown="onKeydown">

var mod = angular.module('mydirectives');
mod.directive('ngKeydown', function() {
  return {
  restrict: 'A',
  link: function(scope, elem, attrs) {
    var functionToCall = scope.$eval(attrs.ngKeydown);
    elem.on('keydown', function(e){
      functionToCall(e.which)
    });
  }};
});
