angular.module('snapnote')
	.factory('API', API);

function API($http, $window) {
	var self = this;

	self.get = function(url, options) {
		return $http.get(url, options);
	}

	self.post = function(url, options) {
		return $http.post(url, options);
	}
	
	self.ls = {
		get(key) {
			return $window.localStorage.getItem(key);
		},
		set(key, value) {
			return $window.localStorage.setItem(key, value);
		},
		clear() {
			return $window.localStorage.clear();
		}
	}

	self.getUsers = function() {
		return self.get('/users')
			.then(response => response.data);
	}
	
	self.getNotes = function(username) {
		return self.get('/notes/' + username)
			.then(response => response.data);
	}
	
	self.createNote = function(form) {
		return self.post('/note', form)
			.then(response => response.data);
	}
	
	self.getNote = function(id) {
		return self.get('/note/' + id)
			.then(response => response.data);
	}
	
	self.getCommentsByNoteId = function(id){
		return $http.get(`/comment/${id}`)
			.then(response => response.data);
	}
	
	self.addComment = function(comment) {
		return $http.post('/comment', comment)
			.then(res => res.data)
			.catch(err => console.error(err))
	}
	
	self.deleteComment = function(id) {
		return $http.delete(`/comment/${id}`)
			.then(res => res.data)
			.catch(err => console.error(err))
	}

	return self;
}