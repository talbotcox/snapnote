/*global DialogElement*/

angular.module('snapnote')
	.controller('landingC', landingC);

function landingC(Auth, $state) {
	var self = this;
	self.signupForm = {};
	self.landingDialog = new DialogElement({events:true});
	
	
	self.documentHandler = function() {
		if (!self.landingDialog.container.contains(event.target)) {
			self.landingDialog.close();		
			self.landingDialog.element.removeEventListener('click', self.documentHandler, true);
		}
		
	}
	
	self.onShowForm = function() {
		self.landingDialog.configure({element:  document.querySelector('#landingForm')})
		self.landingDialog.open();
		
		self.landingDialog.element.addEventListener('click', self.documentHandler, true);
	}

	self.signup = function() {
		self.landingDialog.close();
		self.landingDialog.element.removeEventListener('click', self.documentHandler, true);
		
		return Auth.signup(self.signupForm)
			.then(response => $state.go('user', { username: response.username }));
	}
}