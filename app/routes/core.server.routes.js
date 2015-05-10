'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	app.route('/').get(core.index);

    app.route('/search').get(core.search);
    app.route('/nextsearch').get(core.nextsearch);

};
