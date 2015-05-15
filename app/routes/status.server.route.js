'use strict';

/**
 * Module dependencies.
 */
var stat = require('../../app/controllers/status.server.controller.js');

module.exports = function(app) {
	// Article Routes
	app.route('/status')
			.get(stat.list);
};
