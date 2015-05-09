'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$http', '$location',
    function ($scope, Authentication, $http, $location) {
        // This provides Authentication context.
        $scope.authentication = Authentication;
        $scope.visible = true;
        $scope.searching = false;

        // Create new Buzzrequest
        $scope.search = function () {
            $scope.searching = true;
            $http({
                url: '/search',
                method: 'GET',
                params: {
                    search_query: this.search_query
                }
            }).success(function (response) {
                $scope.postings = response.postings;
                $scope.visible = false;
                $scope.searching = false;
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
