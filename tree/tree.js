angular.module('app').directive('tree', function ($compile, $http, $timeout, TreeService, TreeNode) {
	return {
		restrict: 'A',
		scope: {
			selected: '=',
			ngSetNode: '=',
			filterIds: '='
		},
		replace: true,
		templateUrl: '/_layouts/15/Wargaming.TP.Web/views/treeView.html',
        controller: function($scope, $element){
        	$scope.tree = [];
        	$scope.selectedText = "";
        	$scope.query = {};
            $scope._treeVisible = false;
            $scope._searchVisible = false;
			
	        $scope.loadTree = function() {
		        TreeService.load().then(function() {
			        $scope.nodesList = TreeService.nodesList;

			        if ($scope.selected && $scope.selected.length > 0) {
				        $scope.nodesList.forEach(function(node) {
					        $scope.selected.forEach(function(id) {
						        if (node.id == id) {
							        node._isChecked = true;
						        }
					        });
				        });
				        $scope.calculateSelectedText();
			        }
		        });
	        };
	        $scope.calculateSelectedText = function () {
		        if ($scope.selected.length > 0) {
		        	$scope.selectedText = Enumerable.From($scope.nodesList).Where(function (elem) { return elem._isChecked && elem._parent != null; }).Select(function (elem) { return elem.name; }).Aggregate(function (i, j) { return i + "; " + j; });
		        } else {
			        $scope.selectedText = '';
		        }
	        };
            $scope.isLastChild = function (node) {
            	return node._children.length < 1 && (node._parent == null || node.id == node._parent._children[node._parent._children.length - 1].id);
            };
	        $scope.isExpand = function(node) {
		        return node._children && node._children.length > 0 && node._children[0]._display;
	        };
	        $scope.toggleExpand = function (node, e) {
				if(e) e.stopPropagation();
				if (!node._children || node._children.length < 1)
            		return false;
				
				var display = !node._children[0]._display;
				node._children.forEach(function (child) {
            		child._display = display;
            	});
            };
	        $scope.changeNode = function () {
	        	$scope.selected = Enumerable.From($scope.nodesList).Where(function(elem) { return elem._isChecked && elem._parent != null; }).Select(function (elem) { return elem.id; }).ToArray();
		        $scope.calculateSelectedText();
				if($scope.ngSetNode)
            		$timeout($scope.ngSetNode);
            };

			/* Обработка чека по чекбоксу */
	        $scope.checkedNode = function (node) {
	        	var isChecked = node._isChecked;
	        	toggleChecked(node, isChecked);
	        	parentChecked(node, isChecked);
		        $scope.changeNode();
	        };
	        function toggleChecked(node, value) {
	        	node._isChecked = value;
	        	if (node._children && node._children.length > 0) {
			        node._children.forEach(function(child) {
				        toggleChecked(child, value);
			        });
		        }
            };
	        function parentChecked(node) {
	        	if (!node._parent)
                    return;
                var parentIsChecked = true;
                node._parent._children.forEach(function (child) {
                	if (child._isChecked != true)
                		parentIsChecked = false;
                });
                node._parent._isChecked = parentIsChecked;
                parentChecked(node._parent);

	        }

	        $scope.loadTree();
	        $scope.$watch('filterIds', function (newVal, oldVal) {
		        if ($scope.filterIds == undefined || $scope.filterIds == null) return; 
		        Enumerable.From($scope.nodesList).Where(function(elem) { return elem._parent == null; }).ToArray().forEach(function (node) {
			        if ($scope.filterIds.length == 0) {
				        node._display = true;
			        } else {
			        	if (Enumerable.From($scope.filterIds).Any(function(elem) { return elem == node.id; })) {
					        node._display = true;
				        } else {
			        		node._isChecked = false;
			        		node._display = false;
			        		$scope.checkedNode(node);
				        }
			        }
		        });
	        }, true);
        }
	};
});