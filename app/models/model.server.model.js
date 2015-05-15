'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Model Schema
 */
var ModelSchema = new Schema({
    model: {
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
    },
    make: {
        type: Schema.ObjectId,
        ref: 'Make'
    }
});

mongoose.model('Model', ModelSchema);
