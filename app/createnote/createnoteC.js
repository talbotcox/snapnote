angular.module('snapnote')
	.controller('createnoteC', createnoteC);

function createnoteC(Upload, API, $state) {
	var self = this;
	self.createForm = {};

	self.create = function() {

		self.createForm.keywords = JSON.stringify(self.createForm.keywords.split(' '));

		Upload.upload({
			url: '/note',
			data: self.createForm
		})
		.then(response => {
			$state.go('user', {
				username: API.ls.get('username')
			});
		})
		.catch(e => console.log(e));
	}
}