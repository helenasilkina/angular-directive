angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
angular.module('ui.bootstrap.demo', ['peoplepickerModule']).controller('TypeaheadCtrl', function($scope, $http) {
	$scope.peopleSelected = [];
	$scope.peopleQuery= 'http://maps.googleapis.com/maps/api/geocode/json';
 }); 