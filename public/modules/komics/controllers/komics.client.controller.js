'use strict';

// Komics controller
angular.module('komics').controller('KomicsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Komics', 'Reviews',
	function($scope, $stateParams, $location, Authentication, Komics, Reviews ) {
		$scope.authentication = Authentication;
		$scope.review_state = false;

		// Create new Komic
		$scope.create = function() {
			// Create new Komic object
			var komic = new Komics ({
				title: this.title,
				description: this.description,
				genres: this.genres
			});

			// Redirect after save
			komic.$save(function(response) {
				$location.path('komics/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.description = '';
				$scope.genre = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Add Review to Komic
		$scope.addReview = function() {
			var review = new Reviews ({
				komicId: $scope.komic._id,
				review: this.review
			});
			console.log(review);
			$scope.komic.reviews.push({review: this.review, user: Authentication.user.displayName, created: Date.now()});
			review.$save(function(response) {
				$scope.komic = response;
				console.log(response);
			},function(errorResponse) {
				$scope.error =errorResponse.data.message;
			});
			$scope.review_state = false;
			$scope.review = '';
		};


		// Remove Review from Komic
		$scope.removeReview = function(rev) {
			var review = new Reviews({
				komicId: $scope.komic._id,
				_id: rev._id
			});

			review.$remove(function(response) {
				for (var i in $scope.komic.reviews) {
					if ($scope.komic.reviews[i] === rev) {
						$scope.komic.reviews.splice(i, 1);
					}
				} 
			},function(errorResponse) {
					$scope.error = errorResponse.data.message;
				
			});
		};

		// Remove existing Komic
		$scope.remove = function( komic ) {
			if ( komic ) { komic.$remove();

				for (var i in $scope.komics ) {
					if ($scope.komics [i] === komic ) {
						$scope.komics.splice(i, 1);
					}
				}
			} else {
				$scope.komic.$remove(function() {
					$location.path('komics');
				});
			}
		};

		// Update existing Komic
		$scope.update = function() {
			var komic = $scope.komic ;

			komic.$update(function() {
				$location.path('komics/' + komic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Komics
		$scope.find = function() {
			$scope.komics = Komics.query();
		};

		// Find existing Komic
		$scope.findOne = function() {
			$scope.komic = Komics.get({ 
				komicId: $stateParams.komicId
			});
		};

		$scope.show_review = function() {
        	$scope.review_state = $scope.review_state === false ? true: false;
      	};

      	// $scope.show_review_list = function() {
      	// 	for (var i in $scope.komic.reviews) 
      	// };
	}
]);