angular.module('snapnote')
	.controller('landingC', landingC);

function landingC(API, $window, $state) {
	var self = this;
	self.signinForm = {};
	self.signupForm = {};

	self.signin = function() {
		API.signin(self.signinForm)
			.then(response => {
				if (response.token) {
					$window.localStorage.setItem('token', response.token);
					$state.go('profile');
				} else {
					console.log(response);
				}
			});
	}

	self.signup = function() {
		API.signup(self.signupForm)
			.then(response => {
				if (response.id) {
					self.signinForm = self.signupForm;
					self.signin();
				} else {
					console.log(response);
				}
			});
	}
}