'use strict';

// Configuring the Articles module
angular.module('komics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Komics', 'komics', 'dropdown', '/komics(/create)?');
		Menus.addSubMenuItem('topbar', 'komics', 'List Komics', 'komics');
		Menus.addSubMenuItem('topbar', 'komics', 'New Komic', 'komics/create');
	}
]);