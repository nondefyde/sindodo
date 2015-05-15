'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Year = mongoose.model('Year'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, year;

/**
 * Year routes tests
 */
describe('Year CRUD tests', function() {
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

		// Save a user to the test db and create new Year
		user.save(function() {
			year = {
				name: 'Year Name'
			};

			done();
		});
	});

	it('should be able to save Year instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Year
				agent.post('/years')
					.send(year)
					.expect(200)
					.end(function(yearSaveErr, yearSaveRes) {
						// Handle Year save error
						if (yearSaveErr) done(yearSaveErr);

						// Get a list of Years
						agent.get('/years')
							.end(function(yearsGetErr, yearsGetRes) {
								// Handle Year save error
								if (yearsGetErr) done(yearsGetErr);

								// Get Years list
								var years = yearsGetRes.body;

								// Set assertions
								(years[0].user._id).should.equal(userId);
								(years[0].name).should.match('Year Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Year instance if not logged in', function(done) {
		agent.post('/years')
			.send(year)
			.expect(401)
			.end(function(yearSaveErr, yearSaveRes) {
				// Call the assertion callback
				done(yearSaveErr);
			});
	});

	it('should not be able to save Year instance if no name is provided', function(done) {
		// Invalidate name field
		year.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Year
				agent.post('/years')
					.send(year)
					.expect(400)
					.end(function(yearSaveErr, yearSaveRes) {
						// Set message assertion
						(yearSaveRes.body.message).should.match('Please fill Year name');
						
						// Handle Year save error
						done(yearSaveErr);
					});
			});
	});

	it('should be able to update Year instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Year
				agent.post('/years')
					.send(year)
					.expect(200)
					.end(function(yearSaveErr, yearSaveRes) {
						// Handle Year save error
						if (yearSaveErr) done(yearSaveErr);

						// Update Year name
						year.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Year
						agent.put('/years/' + yearSaveRes.body._id)
							.send(year)
							.expect(200)
							.end(function(yearUpdateErr, yearUpdateRes) {
								// Handle Year update error
								if (yearUpdateErr) done(yearUpdateErr);

								// Set assertions
								(yearUpdateRes.body._id).should.equal(yearSaveRes.body._id);
								(yearUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Years if not signed in', function(done) {
		// Create new Year model instance
		var yearObj = new Year(year);

		// Save the Year
		yearObj.save(function() {
			// Request Years
			request(app).get('/years')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Year if not signed in', function(done) {
		// Create new Year model instance
		var yearObj = new Year(year);

		// Save the Year
		yearObj.save(function() {
			request(app).get('/years/' + yearObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', year.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Year instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Year
				agent.post('/years')
					.send(year)
					.expect(200)
					.end(function(yearSaveErr, yearSaveRes) {
						// Handle Year save error
						if (yearSaveErr) done(yearSaveErr);

						// Delete existing Year
						agent.delete('/years/' + yearSaveRes.body._id)
							.send(year)
							.expect(200)
							.end(function(yearDeleteErr, yearDeleteRes) {
								// Handle Year error error
								if (yearDeleteErr) done(yearDeleteErr);

								// Set assertions
								(yearDeleteRes.body._id).should.equal(yearSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Year instance if not signed in', function(done) {
		// Set Year user 
		year.user = user;

		// Create new Year model instance
		var yearObj = new Year(year);

		// Save the Year
		yearObj.save(function() {
			// Try deleting Year
			request(app).delete('/years/' + yearObj._id)
			.expect(401)
			.end(function(yearDeleteErr, yearDeleteRes) {
				// Set message assertion
				(yearDeleteRes.body.message).should.match('User is not logged in');

				// Handle Year error error
				done(yearDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Year.remove().exec();
		done();
	});
});