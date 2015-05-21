'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Model = mongoose.model('Model'),
	_ = require('lodash');

/**
 * Create a Model
 */
exports.create = function(req, res) {
	var model = new Model(req.body);
	model.year = req.year;
    model.make = req.make;

	model.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(model);
		}
	});
};

/**
 * Show the current Model
 */
exports.read = function(req, res) {
	res.jsonp(req.model);
};

/**
 * Update a Model
 */
exports.update = function(req, res) {
	var model = req.model ;

	model = _.extend(model , req.body);

	model.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(model);
		}
	});
};

/**
 * Delete an Model
 */
exports.delete = function(req, res) {
	var model = req.model ;

	model.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(model);
		}
	});
};

/**
 * List of Models
 */
exports.list = function(req, res) { 
	Model.find().sort('make').populate('make', 'make').exec(function(err, models) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(models);
		}
	});
};

/**
 * Model middleware
 */
exports.modelByID = function(req, res, next, id) { 
	Model.findById(id).populate('make', 'make').exec(function(err, model) {
		if (err) return next(err);
		if (! model) return next(new Error('Failed to load Model ' + id));
		req.model = model ;
		next();
	});
};

 exports.modelByYear = function(req,res)
 {
	 Model.find({year:req.params.year,make:req.params.make},function(err,models){
		 if (err) {
			 return res.status(400).send({
				 message: errorHandler.getErrorMessage(err)
			 });
		 } else {
			 res.jsonp(models);
		 }
	 });
 };


/**
 * Model authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.model.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
