'use strict';

//Komics service used to communicate Komics REST endpoints
angular.module('komics').factory('Komics', ['$resource',
	function($resource) {
		return $resource('komics/:komicId', { komicId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
])
.factory('Reviews', ['$resource',
	function($resource) {
		return $resource('komics/:komicId/reviews/:id', { komicId: '@komicId', reviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);