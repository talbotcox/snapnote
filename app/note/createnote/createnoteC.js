angular.module('snapnote')
	.controller('createnoteC', createnoteC);

function createnoteC(Upload, API, $state, $window) {
	var self = this;
	self.createForm = {};

	self.create = function() {

		self.createForm.keywords = JSON.stringify(self.createForm.keywords.split(' '));

		Upload.upload({
			url: '/note',
			data: self.createForm
		})
		.then(response => {
			$state.go('profile');
		})
		.catch(e => console.log(e));
	}

	self.logout = function() {
		$window.localStorage.removeItem('token');
		$state.go('landing');
	}
}