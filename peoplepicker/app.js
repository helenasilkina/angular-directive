angular.module('ui.bootstrap.demo', ['ui.bootstrap', 'peoplepickerModule', 'ngMockE2E'])
	.config( function(peoplepickerConfigProvider) {
		peoplepickerConfigProvider.config = {
			url: '/people'
		};
	})
	.controller('TypeaheadCtrl', function ($scope, $http) {
			$scope.peopleSelected = [];
			//$scope.peopleQuery = '/people';
	})
	.run(function ($httpBackend) {
		$httpBackend.whenGET(/\/people/)
			.respond(function (method, url) {
				var name = decodeURIComponent(url.slice(url.lastIndexOf('=') + 1, url.length));
				var response = [];
				for (var i = 10; i--;) {
					var rand = parseInt(Math.random() * 100);
					response.push({
						Name: name + rand,
						Id: 'id_' + name + rand
					});
				}
				return [200, response];
			})
	});