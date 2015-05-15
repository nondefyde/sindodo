'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Model = mongoose.model('Model'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, model;

/**
 * Model routes tests
 */
describe('Model CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Model
		user.save(function() {
			model = {
				name: 'Model Name'
			};

			done();
		});
	});

	it('should be able to save Model instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Model
				agent.post('/models')
					.send(model)
					.expect(200)
					.end(function(modelSaveErr, modelSaveRes) {
						// Handle Model save error
						if (modelSaveErr) done(modelSaveErr);

						// Get a list of Models
						agent.get('/models')
							.end(function(modelsGetErr, modelsGetRes) {
								// Handle Model save error
								if (modelsGetErr) done(modelsGetErr);

								// Get Models list
								var models = modelsGetRes.body;

								// Set assertions
								(models[0].user._id).should.equal(userId);
								(models[0].name).should.match('Model Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Model instance if not logged in', function(done) {
		agent.post('/models')
			.send(model)
			.expect(401)
			.end(function(modelSaveErr, modelSaveRes) {
				// Call the assertion callback
				done(modelSaveErr);
			});
	});

	it('should not be able to save Model instance if no name is provided', function(done) {
		// Invalidate name field
		model.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Model
				agent.post('/models')
					.send(model)
					.expect(400)
					.end(function(modelSaveErr, modelSaveRes) {
						// Set message assertion
						(modelSaveRes.body.message).should.match('Please fill Model name');
						
						// Handle Model save error
						done(modelSaveErr);
					});
			});
	});

	it('should be able to update Model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Model
				agent.post('/models')
					.send(model)
					.expect(200)
					.end(function(modelSaveErr, modelSaveRes) {
						// Handle Model save error
						if (modelSaveErr) done(modelSaveErr);

						// Update Model name
						model.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Model
						agent.put('/models/' + modelSaveRes.body._id)
							.send(model)
							.expect(200)
							.end(function(modelUpdateErr, modelUpdateRes) {
								// Handle Model update error
								if (modelUpdateErr) done(modelUpdateErr);

								// Set assertions
								(modelUpdateRes.body._id).should.equal(modelSaveRes.body._id);
								(modelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Models if not signed in', function(done) {
		// Create new Model model instance
		var modelObj = new Model(model);

		// Save the Model
		modelObj.save(function() {
			// Request Models
			request(app).get('/models')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Model if not signed in', function(done) {
		// Create new Model model instance
		var modelObj = new Model(model);

		// Save the Model
		modelObj.save(function() {
			request(app).get('/models/' + modelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', model.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Model instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Model
				agent.post('/models')
					.send(model)
					.expect(200)
					.end(function(modelSaveErr, modelSaveRes) {
						// Handle Model save error
						if (modelSaveErr) done(modelSaveErr);

						// Delete existing Model
						agent.delete('/models/' + modelSaveRes.body._id)
							.send(model)
							.expect(200)
							.end(function(modelDeleteErr, modelDeleteRes) {
								// Handle Model error error
								if (modelDeleteErr) done(modelDeleteErr);

								// Set assertions
								(modelDeleteRes.body._id).should.equal(modelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Model instance if not signed in', function(done) {
		// Set Model user 
		model.user = user;

		// Create new Model model instance
		var modelObj = new Model(model);

		// Save the Model
		modelObj.save(function() {
			// Try deleting Model
			request(app).delete('/models/' + modelObj._id)
			.expect(401)
			.end(function(modelDeleteErr, modelDeleteRes) {
				// Set message assertion
				(modelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Model error error
				done(modelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Model.remove().exec();
		done();
	});
});