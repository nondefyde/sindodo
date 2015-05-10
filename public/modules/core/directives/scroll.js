'use strict';

/**
 * Created by Okafor on 10/05/2015.
 */

//go to this link to check out the usage of this directives
//http://stackoverflow.com/questions/24040985/scroll-to-top-of-div-in-angularjs

angular.module('ui.scrollToTopWhen', [])
    .directive('scrollToTopWhen', function ($timeout) {
        function link (scope, element, attrs) {
            scope.$on(attrs.scrollToTopWhen, function () {
                $timeout(function () {
                    angular.element(element)[0].scrollTop = 0;
                });
            });
        }
    });
