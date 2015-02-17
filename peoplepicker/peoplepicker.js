angular.module('peoplepickerModule', ['ui.bootstrap'])
.directive('peoplepicker', function () {
	return {
		restrict: 'E',
		scope: {
			selected: '=',
			url: '=',
			multi: '='
		},
		controller: function($scope,  $http) {
			$scope.getSelectedPeople = function() {
				var selected = $scope.findPeople;
				
				if ($scope.selected.indexOf(selected) == -1) {						
					$scope.selected.push($scope.findPeople); 
				}
				$scope.findPeople = '';
			}
			
			$scope.removePeople = function(index) {
				$scope.selected.splice(index, 1);
			}
		  
			$scope.getPeople = function(val) {
				return $http.get($scope.url, {
				  params: {
					address: val,
					sensor: false
				  }
				}).then(function(response){
				  return response.data.results.map(function(item){
					return item.formatted_address;
				  });
				});
			};
		},
		transclude: true,
		template: '<div class="form-control peoplepicker-wrapper">' +
							'<ul class="peoplepicker-list" ng-show="selected.length > 0">' +
								'<li class="peoplepicker-list-item" ng-repeat="name in selected track by $index">' +
									'{{name}}' +
									'<span class="peoplepicker-remove" ng-click="removePeople($index)">X</span>' +
								'</li>' +
							'</ul>' + 
							'<input class="peoplepicker-input" ng-show="multi" ng-model="findPeople" type="text" placeholder="Введите 3 символа" typeahead-on-select="getSelectedPeople()" typeahead="address for address in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
							'<input class="peoplepicker-input" ng-hide="multi" type="text" ng-model="findPeople" placeholder="Введите 3 символа" typeahead="address for address in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
							'<i ng-show="loadingLocations" class="peoplepicker-refresh glyphicon glyphicon-refresh"></i>' +
					'</div>',
		replace: true
	};
});