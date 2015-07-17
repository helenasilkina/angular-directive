/*
* Currency picker
* @author Helena Silkina
*/
app.directive('currencyPicker', function () {
    return {
        restrict: 'E',
		scope: {
			currencyModel: '=',
			currencies: '='
		},
		template: '<fieldset class="travel-currency-block"><input type="text" ng-model="currencyModel.Value" ng-init="currencyModel.Value=0" class="travel-form-element" ng-change="currencyValidate();" /><select class="travel-form-element" ng-model="currencyModel.Currency"><option ng-init="currencyModel.Currency=currencies[1].Title" ng-selected="currencyModel.Currency==currency.Title" ng-repeat="currency in currencies" value="{{currency.Title}}">{{currency.Title}}</option></select></fieldset>',
        replace: true,
        controller: function ($scope) {	
    			$scope.currencyValidate = function() {
    				if ($scope.currencyModel.Value) {
    					var newValue = $scope.currencyModel.Value.replace(/[^0-9.]/g, '');
    					if (newValue!=$scope.currencyModel.Value) {
    						$scope.currencyModel.Value = newValue;
    					}	
    				}
    			}		
        }
    };
});
