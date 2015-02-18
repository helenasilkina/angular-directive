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
				
				$scope.peopleNames = [];
				$scope.peopleArray = [];
				
				this.addMultiple = function(isMultiple) {
					$scope.multiple = isMultiple;
				}
				
				findInArray = function(array, name) {
					for (var i = array.length - 1; i > -1; i--) {
;						if (array[i].Name == name) {
							return array[i].Id;
						}
					}
					return '';
				}
				
				$scope.getSelectedPeople = function() {
					if ($scope.peopleNames.indexOf($scope.findPeople) == -1) {						
						$scope.peopleNames.push($scope.findPeople); 
						$scope.ngModel.push(findInArray($scope.findPeopleArray, $scope.findPeople));
					}
					$scope.findPeople = '';
				}
				
				$scope.getSelectedPerson = function() {
					$scope.ngModel = findInArray($scope.findPeopleArray, $scope.findPeople);
				} 
				
				$scope.removePeople = function(index) {
					$scope.ngModel.splice(index, 1);
					$scope.peopleNames.splice(index, 1);
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
						$scope.findPeopleArray = response.data;						
					  return array;
					}, 
					function(response){
						console.log('error', response, response.status);
					});
				};
			},
			transclude: true,
			template: '<div class="form-control peoplepicker-wrapper">' +
								'<ul class="peoplepicker-list" ng-show="peopleNames.length > 0">' +
									'<li class="peoplepicker-list-item" ng-repeat="name in peopleNames track by $index">' +
										'{{name}}' +
										'<span class="peoplepicker-remove" ng-click="removePeople($index)">X</span>' +
									'</li>' +
								'</ul>' + 
								'<input class="peoplepicker-input" ng-show="multiple" ng-model="findPeople" type="text" placeholder="Введите более 3 символов" typeahead-on-select="getSelectedPeople()" typeahead="Name for Name in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
								'<input class="peoplepicker-input" ng-hide="multiple" type="text" ng-model="findPeople" placeholder="Введите более 3 символов" typeahead-on-select="getSelectedPerson()" typeahead="Name for Name in getPeople($viewValue)" typeahead-loading="loadingLocations">' +
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