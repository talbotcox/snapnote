angular.module('snapnote')
	.controller('usersC', usersC);

function usersC($window, $state, API) {
	var self = this;

	self.refresh = function() {
		API.getnotes()
			.then(notes => {
				self.notes = notes;
			})
	}

	self.refresh();
}