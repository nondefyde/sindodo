'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		errorHandler = require('./errors.server.controller'),
    Status = mongoose.model('Status');



/**
 * List of States
 */
exports.list = function(req, res) {
    var stat = [
        {value:'registered',name:'Registered'},
        {value:'for_sale',name:'For sale'},
        {value:'for_hire',name:'For hire'},
        {value:'for_rent',name:'For rent'},
        {value:'wanted',name:'For wanted'},
        {value:'lost',name:'For lost'},
        {value:'stolen',name:'For stolen'},
        {value:'found',name:'For found'}
    ];
    res.json(stat);
};



