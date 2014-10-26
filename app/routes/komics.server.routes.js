'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var komics = require('../../app/controllers/komics');

	// Komics Routes
	app.route('/komics')
		.get(komics.list)
		.post(users.requiresLogin, komics.create);

	app.route('/komics/:komicId')
		.get(komics.read)
		.put(users.requiresLogin, komics.hasAuthorization, komics.update)
		.delete(users.requiresLogin, komics.hasAuthorization, komics.delete);

	app.route('/komics/:komicId/reviews')
		.get(komics.listReviews)
		.post(users.requiresLogin, komics.create_rev);

	app.route('/komics/:komicId/reviews/:reviewId')
		.get(komics.readReview)
		.put(users.requiresLogin, komics.hasAuthorization_rev, komics.update_rev)
		.delete(users.requiresLogin, komics.hasAuthorization_rev, komics.delete_rev);

	// Finish by binding the Komic middleware
	app.param('komicId', komics.komicByID);
	app.param('reviewId', komics.reviewByID);
};