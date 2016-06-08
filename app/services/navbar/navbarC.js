angular.module('snapnote')
    .directive('uiNavbar', uiNavbar)
    .controller('navbarC', navbarC);
    
function uiNavbar() {
    return {
        templateUrl: 'app/services/navbar/navbarV.html'
    };
}

function navbarC($state, Auth, API, Upload) {
    var self = this;
    self.Auth = Auth;
    self.API = API;
    self.$state = $state;
    self.states = self.$state.get().filter(s => s.nav);
    
    self.signupForm = {};
	self.landingDialog = new DialogElement({events:true});
    
    self.loginForm = {};
    
    self.login = function() {
        return self.Auth.login(self.loginForm)
            .then(response => $state.go('user', { username: response.username }));
    }
    
    self.logout = function() {
        self.Auth.logout();
        $state.go('landing');
    }
    
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


































// angular.module('snapnote')
//     .directive('uiNavbar', uiNavbar)
//     .controller('navbarC', navbarC);
    
// function uiNavbar() {
//     return {
//         templateUrl: 'app/services/navbar/navbarV.html'
//     };
// }

// function navbarC($state, Auth, API) {
//     var self = this;
//     self.Auth = Auth;
//     self.API = API;
//     self.$state = $state;
//     self.states = self.$state.get().filter(s => s.nav);
    
//     self.loginForm = {};
    
//     self.login = function() {
//         return self.Auth.login(self.loginForm)
//             .then(response => $state.go('user', { username: response.username }));
//     }
    
//     self.logout = function() {
//         self.Auth.logout();
//         $state.go('landing');
//     }
// }