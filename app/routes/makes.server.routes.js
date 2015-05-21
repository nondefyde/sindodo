'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var makes = require('../../app/controllers/makes.server.controller');

	// Makes Routes
	app.route('/makes')
		.get(makes.list)
		.post(users.requiresLogin, makes.create);

	app.route('/makes/:makeId')
		.get(makes.read)
		.put(users.requiresLogin, makes.hasAuthorization, makes.update)
		.delete(users.requiresLogin, makes.hasAuthorization, makes.delete);

	app.route('/api/makes/:year')
		.get(makes.makesByYear);

	// Finish by binding the Make middleware

	app.param('makeId', makes.makeByID);
};
