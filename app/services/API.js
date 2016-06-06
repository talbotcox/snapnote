angular.module('snapnote')
	.factory('API', API);

function API($http) {
	var self = this;

	self.get = function(url, options) {
		return $http.get(url, options);
	}

	self.post = function(url, options) {
		return $http.post(url, options);
	}

	self.signin = function(options) {
		return self.post('/login', options)
			.then(response => response.data);
	}

	self.signup = function(options) {
		return self.post('/signup', options)
			.then(response => response.data);
	}

	self.createnote = function(options) {
		return self.post('/note', options);
	}

	self.getnotes = function() {
		return self.get('/notes')
			.then(response => response.data);
	}

	self.getnote = function(id) {
		return self.get('/note/' + id)
			.then(response => response.data);
	}

	return self;
}