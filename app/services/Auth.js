angular.module('snapnote')
    .factory('Auth', Auth);
    
function Auth(API) {
    var self = this;
    
    self.login = function(form) {
        return API.post('/login', form)
			.then(response => {
			   // Store user data in LocalStorage
			   for (var key in response.data) API.ls.set(key, response.data[key]);
			   return response.data;
			});
    }
    
    self.signup = function(form) {
        return API.post('/signup', form)
            .then(() => self.login(form));
    }
    
    self.logout = function() {
        return API.ls.clear();
    }
    
    self.isAuth = function() {
        return !!API.ls.get('token');
    }
    
    return self;
}