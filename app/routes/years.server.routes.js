'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var years = require('../../app/controllers/years.server.controller');

	// Years Routes
	app.route('/years')
		.get(years.list)
		.post(users.requiresLogin, years.create);


	app.route('/years/:yearId')
		.get(years.read)
		.put(users.requiresLogin, years.hasAuthorization, years.update)
		.delete(users.requiresLogin, years.hasAuthorization, years.delete);

	// Finish by binding the Year middleware
	app.param('yearId', years.yearByID);
};
