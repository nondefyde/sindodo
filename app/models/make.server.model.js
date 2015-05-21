'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Make Schema
 */
var MakeSchema = new Schema({
	make: {
		type: String,
		default: '',
		required: 'Please fill Make name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	year: {
		type: Schema.ObjectId,
		ref: 'Year'
	}
});

mongoose.model('Make', MakeSchema);
