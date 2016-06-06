angular.module('snapnote')
	.controller('noteC', noteC);

function noteC(API, $stateParams, $window, $state) {
	var self = this;

	self.refresh = function() {

		API.getnote($stateParams.id)
			.then(response => self.note = response);
	}

	self.logout = function() {
		$window.localStorage.removeItem('token');
		$state.go('landing');
	}

	self.refresh();
}