'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

/**
 * Buzzrequest Schema
 */
var StatusSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill State name',
		trim: true
	},
    value: {
        type: String,
        default: '',
        required: 'Please fill State name',
        trim: true
    },
	created: {
		type: Date,
		default: Date.now
	}
});




mongoose.model('Status',StatusSchema );
