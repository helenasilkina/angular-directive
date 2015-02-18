angular.module('peoplepickerModule', ['ui.bootstrap'])
.value('config', {
	url: '/people'
})
.directive('peoplepicker', ['config', 'peoplepickerConfig', function (config, peoplepickerConfig) {
	return {
		restrict: 'E',
		scope: {
			ngModel: '='
		},
		link: function( scope, element, attrs ) {
        angular.extend( config, peoplepickerConfig.config );
    },
		controller: function($scope,  $http) {
			this.addMultiple = function(isMultiple) {
				$scope.multiple = isMultiple;
			}
			
			$scope.getSelectedPeople = function() {
				var selected = $scope.findPeople;
				
				if ($scope.ngModel.indexOf(selected) == -1) {						
					$scope.ngModel.push($scope.findPeople); 
				}
				$scope.findPeople = '';
			}
			
			$scope.removePeople = function(index) {
				$scope.ngModel.splice(index, 1);
			}
		  
			$scope.getPeople = function(val) {
				return $http.get(config.url, {
				  params: {
					Name: val
				  }
				}).then(function(response){
					var array = [];
					for (var i = response.data.length - 1; i > -1; i--) {
							array.push(response.data[i].Name);
					}				  
				  return array;
				}, 
				function(response){
					console.log('error', response, response.status);
				});
			};
		},
		transclude: true,
		template: '<div class="form-control peoplepicker-wrapper">' +
							'<ul class="peoplepicker-list" ng-show="ngModel.length > 0">' +
								'<li class="peoplepicker-list-item" ng-repeat="name in ngModel track by $index">' +
									'{{name}}' +
									'<span class="peoplepicker-remove" ng-click="removePeople($index)">X</span>' +
								'</li>' +
							'</ul>' + 
							'<input class="peoplepicker-input" ng-show="multiple" ng-model="findPeople" type="text" placeholder="Введите более 3 символов" typeahead-on-select="getSelectedPeople()" typeahead="Name for Name in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
							'<input class="peoplepicker-input" ng-hide="multiple" type="text" ng-model="findPeople" placeholder="Введите более 3 символов" typeahead="Name for Name in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
							'<i ng-show="loadingLocations" class="peoplepicker-refresh glyphicon glyphicon-refresh"></i>' +
					'</div>',
		replace: true
	};
}])
.directive('multiple', function() {
	return {
		require: 'peoplepicker',
		restrict: 'A',
		link: function(scope, element, attrs, multipleCtrl) {
		  multipleCtrl.addMultiple(true);
		}
	};
})
.provider( 'peoplepickerConfig', function() {
var self = this;
this.config = {};
this.$get = function() {
    var extend = {};
    extend.config = self.config;
    return extend;
};
return this;
});
