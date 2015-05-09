'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location',
    function ($scope, Authentication, $http, $location) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        // Create new Buzzrequest
        $scope.search = function () {

            $http({
                url: '/search',
                method: 'GET',
                params: {
                    search_query: this.search_query
                }
            }).success(function (response) {
                $scope.postings = response.postings;
            }).error(function (error) {
                alert('error');
            });

            //
            //$http.get('/search')
            //    .success(function (response) {
            //        $scope.postings = response.postings;
            //    })
            //    .error(function (error) {
            //        alert('error');
            //    });
        };
    }
]);
