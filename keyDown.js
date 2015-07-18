// <input type="text" ng-keydown="onKeydown">

angular.module('mydirectives').directive('ngKeydown', function() {
  return {
  restrict: 'A',
  link: function(scope, elem, attrs) {
    var functionToCall = scope.$eval(attrs.ngKeydown);
    elem.on('keydown', function(e){
      functionToCall(e.which)
    });
  }};
});
