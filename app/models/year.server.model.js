'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Year Schema
 */
var YearSchema = new Schema({
	year: {
		type: String,
		default: '',
		required: 'Please fill Year name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Year', YearSchema);
