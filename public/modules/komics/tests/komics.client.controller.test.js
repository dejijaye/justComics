'use strict';

(function() {
	// Komics Controller Spec
	describe('Komics Controller Tests', function() {
		// Initialize global variables
		var KomicsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Komics controller.
			KomicsController = $controller('KomicsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Komic object fetched from XHR', inject(function(Komics) {
			// Create sample Komic using the Komics service
			var sampleKomic = new Komics({
				name: 'New Komic'
			});

			// Create a sample Komics array that includes the new Komic
			var sampleKomics = [sampleKomic];

			// Set GET response
			$httpBackend.expectGET('komics').respond(sampleKomics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.komics).toEqualData(sampleKomics);
		}));

		it('$scope.findOne() should create an array with one Komic object fetched from XHR using a komicId URL parameter', inject(function(Komics) {
			// Define a sample Komic object
			var sampleKomic = new Komics({
				name: 'New Komic'
			});

			// Set the URL parameter
			$stateParams.komicId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/komics\/([0-9a-fA-F]{24})$/).respond(sampleKomic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.komic).toEqualData(sampleKomic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Komics) {
			// Create a sample Komic object
			var sampleKomicPostData = new Komics({
				name: 'New Komic'
			});

			// Create a sample Komic response
			var sampleKomicResponse = new Komics({
				_id: '525cf20451979dea2c000001',
				name: 'New Komic'
			});

			// Fixture mock form input values
			scope.name = 'New Komic';

			// Set POST response
			$httpBackend.expectPOST('komics', sampleKomicPostData).respond(sampleKomicResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Komic was created
			expect($location.path()).toBe('/komics/' + sampleKomicResponse._id);
		}));

		it('$scope.update() should update a valid Komic', inject(function(Komics) {
			// Define a sample Komic put data
			var sampleKomicPutData = new Komics({
				_id: '525cf20451979dea2c000001',
				name: 'New Komic'
			});

			// Mock Komic in scope
			scope.komic = sampleKomicPutData;

			// Set PUT response
			$httpBackend.expectPUT(/komics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/komics/' + sampleKomicPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid komicId and remove the Komic from the scope', inject(function(Komics) {
			// Create new Komic object
			var sampleKomic = new Komics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Komics array and include the Komic
			scope.komics = [sampleKomic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/komics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleKomic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.komics.length).toBe(0);
		}));
	});
}());