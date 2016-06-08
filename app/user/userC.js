angular.module('snapnote')
	.controller('userC', userC);

function userC(API, $stateParams) {
	var self = this;

	self.refresh = function() {
		API.getNotes($stateParams.username)
			.then(notes => self.notes = notes)
	}

	self.refresh();
}
