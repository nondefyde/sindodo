'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Year = mongoose.model('Year'),
	_ = require('lodash');

/**
 * Create a Year
 */
exports.create = function(req, res) {
	var year = new Year(req.body);
	year.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(year);
		}
	});
};

/**
 * Show the current Year
 */
exports.read = function(req, res) {
	res.jsonp(req.year);
};

/**
 * Update a Year
 */
exports.update = function(req, res) {
	var year = req.year ;

	year = _.extend(year , req.body);

	year.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(year);
		}
	});
};

/**
 * Delete an Year
 */
exports.delete = function(req, res) {
	var year = req.year ;

	year.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(year);
		}
	});
};

/**
 * List of Years
 */
exports.list = function(req, res) {
	Year.find().sort('year').exec(function(err, years) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(years);
		}
	});
};

/**
 * Year middleware
 */
exports.yearByID = function(req, res, next, id) { 
	Year.findById(id).exec(function(err, year) {
		if (err) return next(err);
		if (! year) return next(new Error('Failed to load Year ' + id));
		req.year = year ;
		next();
	});
};

/**
 * Year authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.year.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};




