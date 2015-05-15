'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Make = mongoose.model('Make'),
	_ = require('lodash');

/**
 * Create a Make
 */
exports.create = function(req, res) {
	var make = new Make(req.body);
	make.year = req.year;

	make.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(make);
		}
	});
};

/**
 * Show the current Make
 */
exports.read = function(req, res) {
	res.jsonp(req.make);
};

/**
 * Update a Make
 */
exports.update = function(req, res) {
	var make = req.make ;

	make = _.extend(make , req.body);

	make.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(make);
		}
	});
};

/**
 * Delete an Make
 */
exports.delete = function(req, res) {
	var make = req.make ;

	make.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(make);
		}
	});
};

/**
 * List of Makes
 */
exports.list = function(req, res) { 
	Make.find().sort('make').populate('year', 'year').exec(function(err, makes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(makes);
		}
	});
};

/**
 * Make middleware
 */
exports.makeByID = function(req, res, next, id) { 
	Make.findById(id).populate('year', 'year').exec(function(err, make) {
		if (err) return next(err);
		if (! make) return next(new Error('Failed to load Make ' + id));
		req.make = make ;
		next();
	});
};

/**
 * Make authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.make.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
