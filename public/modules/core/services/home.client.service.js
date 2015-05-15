'use strict';
/**
 * Created by Okafor on 13/05/2015.
 */

angular.module('core')
    .factory('Status', ['$resource', function ($resource) {

        return $resource('/status');

    }])
    .factory('Search', ['$resource', function ($resource) {

        return $resource('/status');

    }])
    .factory('Year', ['$resource', function ($resource) {

        return $resource('/years');

    }]);
