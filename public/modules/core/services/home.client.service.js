'use strict';
/**
 * Created by Okafor on 13/05/2015.
 */

angular.module('core').factory('CarService', ['$resource', function ($resource) {

        return{

            Status : $resource('/status'),
            Years :  $resource('/years'),
            Makes :  $resource('/makes'),
            Models : $resource('/models'),
            MakesByYear : $resource('/api/makes/:year',{},{get:{method:'GET',isArray:true}}),
            ModelsByMake : $resource('/api/models/:year/:make',{},{get:{method:'GET',isArray:true}})

        };

    }]);
