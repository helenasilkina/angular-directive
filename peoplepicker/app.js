angular.module('ui.bootstrap.demo', ['ui.bootstrap', 'peoplepickerModule', 'ngMockE2E'])
    .controller('TypeaheadCtrl', function ($scope, $http) {
        $scope.peopleSelected = [];
        $scope.peopleQuery = '/people';
    })
.run(function ($httpBackend) {
    $httpBackend.whenGET(/\/people/)
        .respond(function (method, url, data) {
            var name = decodeURIComponent(url.slice(url.indexOf('=')+1, url.length));
            var response = [];
            for (var i = 10; i--;) {
                var rand = parseInt(Math.random() * 100);
                response.push({
                    Name: name + rand,
                    Id: 'id_' + name + rand
                });
            }
            return response;
        })
});