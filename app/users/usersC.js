angular.module('snapnote')
	.controller('usersC', usersC);

function usersC(API) {
	var self = this;

	self.refresh = function() {
		API.getUsers()
			.then(users => self.users = users)
	}

	self.refresh();
}