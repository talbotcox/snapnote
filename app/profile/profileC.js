angular.module('snapnote')
	.controller('profileC', profileC);

function profileC($window, $state, API) {
	var self = this;

	self.logout = function() {
		$window.localStorage.removeItem('token');
		$state.go('landing');
	}

	self.refresh = function() {
		API.getnotes()
			.then(notes => {
				self.notes = notes;
			})
	}

	self.refresh();
}