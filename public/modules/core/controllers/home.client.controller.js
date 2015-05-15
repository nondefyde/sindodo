'use strict';


angular.module('core')
    .controller('HomeController', ['$scope', 'Authentication', '$http', '$log', '$location', '$anchorScroll', 'Status','$filter','Year',
        function ($scope, Authentication, $http, $log, $location, $anchorScroll, Status,$filter,Year) {
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
                        search_query: this.keywords,
                        status: this.status
                    }
                }).success(function (response) {
                    $scope.postings = response.postings;
                    $scope.visible = false;
                    $scope.searching = false;

                    $scope.totalItems = response.num_matches;
                    $scope.currentPage = response.next_page + 1;


                    $scope.maxSize = 5;
                    $scope.bigTotalItems = response.num_matches / 10;
                    $scope.bigCurrentPage = response.next_page;


                }).error(function (error) {
                    $log.log('Error ' + error);
                });
            };

            $scope.setPage = function (pageNo) {
                //alert('i got here '+pageNo);

                $http({
                    url: '/nextsearch',
                    method: 'GET',
                    params: {
                        search_query: this.keywords,
                        page: (pageNo - 1),
                        status: this.status
                    }
                }).success(function (response) {
                    $scope.postings = response.postings;
                    $scope.visible = false;
                    $scope.searching = false;

                    $scope.totalItems = response.num_matches;
                    $scope.currentPage = response.next_page + 1;


                    $scope.maxSize = 10;
                    $scope.bigTotalItems = response.num_matches / 10;
                    $scope.bigCurrentPage = response.next_page;

                    $scope.currentPage = pageNo;

                    $location.hash('top');

                    // call $anchorScroll()
                    $anchorScroll();


                }).error(function (error) {
                    $log.log('Error ' + error);
                });
            };

            $scope.pageChanged = function () {
                alert('i got here 2');
                $log.log('Page changed to: ' + $scope.currentPage);
            };

            //$scope.goUp = function() {
            //    // set the location.hash to the id of
            //    // the element you wish to scroll to.
            //    $location.hash('top');
            //
            //    // call $anchorScroll()
            //    $anchorScroll();
            //};

            $scope.getAnotation = function (annotation) {

                var filtered_aannotation = {
                    make: annotation.make,
                    type: annotation.type,
                    year: annotation.year,
                    drive: annotation.drive,
                    color: annotation.paint_color,
                    mileage: $filter('number')(annotation.mileage,0)

                };

                var newObject = {};
                for (var key in filtered_aannotation) { // iterate through all properties
                    if (filtered_aannotation.hasOwnProperty(key)){ // safety check against object poisoning
                        if (angular.isUndefined(filtered_aannotation[key]) || filtered_aannotation[key]==='' ) { // only push true values
                            // + converts the key to a number. Remove it if you want string
                            continue;
                        }
                        newObject[key] = filtered_aannotation[key];
                    }
                }

                console.log(newObject);

                // i will use lodash to remove keys whose values are null;

                return newObject;
            };

            $scope.status = Status.query();

            $scope.years = Year.query();
        }
    ]);
