'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var models = require('../../app/controllers/models.server.controller');

	// Models Routes
	app.route('/models')
		.get(models.list)
		.post(users.requiresLogin, models.create);

	app.route('/models/:modelId')
		.get(models.read)
		.put(users.requiresLogin, models.hasAuthorization, models.update)
		.delete(users.requiresLogin, models.hasAuthorization, models.delete);

	// Finish by binding the Model middleware
	app.param('modelId', models.modelByID);
};
