angular.directive('clickOutside', ['$document', function($document){
       return {
           scope: {},
           link: function(scope, element, attrs){
               var toggledClass = attrs.toggledClass,
                  wrapperClass = attrs.wrapperClass,
                  elementParent = element.parent();
               element.on('click', function(event){
                   event.stopPropagation();
                   elementParent.toggleClass(toggledClass);
                   if(elementParent.hasClass(toggledClass)) {
                       $document.on(wrapperClass, function(event){
                           if(angular.element(event.target).closest(elementParent).length  && angular.element(event.target) !== element) {
                               return false;
                           }
                           elementParent.removeClass(toggledClass);
                           $document.off(wrapperClass);
                       });
                   } else {
                       $document.off(wrapperClass);
                   }
               });
           }
       } 
    }])
