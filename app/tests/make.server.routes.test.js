'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Make = mongoose.model('Make'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, make;

/**
 * Make routes tests
 */
describe('Make CRUD tests', function() {
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

		// Save a user to the test db and create new Make
		user.save(function() {
			make = {
				name: 'Make Name'
			};

			done();
		});
	});

	it('should be able to save Make instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Make
				agent.post('/makes')
					.send(make)
					.expect(200)
					.end(function(makeSaveErr, makeSaveRes) {
						// Handle Make save error
						if (makeSaveErr) done(makeSaveErr);

						// Get a list of Makes
						agent.get('/makes')
							.end(function(makesGetErr, makesGetRes) {
								// Handle Make save error
								if (makesGetErr) done(makesGetErr);

								// Get Makes list
								var makes = makesGetRes.body;

								// Set assertions
								(makes[0].user._id).should.equal(userId);
								(makes[0].name).should.match('Make Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Make instance if not logged in', function(done) {
		agent.post('/makes')
			.send(make)
			.expect(401)
			.end(function(makeSaveErr, makeSaveRes) {
				// Call the assertion callback
				done(makeSaveErr);
			});
	});

	it('should not be able to save Make instance if no name is provided', function(done) {
		// Invalidate name field
		make.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Make
				agent.post('/makes')
					.send(make)
					.expect(400)
					.end(function(makeSaveErr, makeSaveRes) {
						// Set message assertion
						(makeSaveRes.body.message).should.match('Please fill Make name');
						
						// Handle Make save error
						done(makeSaveErr);
					});
			});
	});

	it('should be able to update Make instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Make
				agent.post('/makes')
					.send(make)
					.expect(200)
					.end(function(makeSaveErr, makeSaveRes) {
						// Handle Make save error
						if (makeSaveErr) done(makeSaveErr);

						// Update Make name
						make.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Make
						agent.put('/makes/' + makeSaveRes.body._id)
							.send(make)
							.expect(200)
							.end(function(makeUpdateErr, makeUpdateRes) {
								// Handle Make update error
								if (makeUpdateErr) done(makeUpdateErr);

								// Set assertions
								(makeUpdateRes.body._id).should.equal(makeSaveRes.body._id);
								(makeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Makes if not signed in', function(done) {
		// Create new Make model instance
		var makeObj = new Make(make);

		// Save the Make
		makeObj.save(function() {
			// Request Makes
			request(app).get('/makes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Make if not signed in', function(done) {
		// Create new Make model instance
		var makeObj = new Make(make);

		// Save the Make
		makeObj.save(function() {
			request(app).get('/makes/' + makeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', make.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Make instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Make
				agent.post('/makes')
					.send(make)
					.expect(200)
					.end(function(makeSaveErr, makeSaveRes) {
						// Handle Make save error
						if (makeSaveErr) done(makeSaveErr);

						// Delete existing Make
						agent.delete('/makes/' + makeSaveRes.body._id)
							.send(make)
							.expect(200)
							.end(function(makeDeleteErr, makeDeleteRes) {
								// Handle Make error error
								if (makeDeleteErr) done(makeDeleteErr);

								// Set assertions
								(makeDeleteRes.body._id).should.equal(makeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Make instance if not signed in', function(done) {
		// Set Make user 
		make.user = user;

		// Create new Make model instance
		var makeObj = new Make(make);

		// Save the Make
		makeObj.save(function() {
			// Try deleting Make
			request(app).delete('/makes/' + makeObj._id)
			.expect(401)
			.end(function(makeDeleteErr, makeDeleteRes) {
				// Set message assertion
				(makeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Make error error
				done(makeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Make.remove().exec();
		done();
	});
});