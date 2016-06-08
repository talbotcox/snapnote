angular.module('snapnote', ['ui.router', 'ngFileUpload'])
	.config(Config)
	.factory('AttachTokens', AttachTokens)
	.run(SetupRouteAuth);

// Routing Setup
function Config($stateProvider, $urlRouterProvider,$httpProvider) {

	// If unknown state direct to '/' (landing)
	$urlRouterProvider.otherwise('/');

	$stateProvider
		// Login/Signup page
		.state('landing', {
			url: '/',
			templateUrl: 'app/landing/landingV.html',
			controller: 'landingC as landingC'
		})
		// Searchable list of users
		.state('users', {
			url: '/users',
			templateUrl: 'app/users/usersV.html',
			controller: 'usersC as usersC',
			auth: true
		})
		// Specific user profile, along with searchable list of notes
		.state('user', {
			url: '/users/:username',
			templateUrl: 'app/user/userV.html',
			controller: 'userC as userC',
			auth: true
		})
		// Information/comments on a particular note
		.state('note', {
			url: '/notes/:id',
			templateUrl: 'app/note/noteV.html',
			controller: 'noteC as noteC',
			auth: true
		})
		// Note creation page
		.state('createnote', {
			url: '/createnote',
			templateUrl: 'app/createnote/createnoteV.html',
			controller: 'createnoteC as createnoteC',
			auth: true
		});

	// Adds the factory (below) to intercept all http requests
	$httpProvider.interceptors.push('AttachTokens');

}

// Attaches tokens if they exists
function AttachTokens($window) {
	return {
		request(config) {
			var jwt = $window.localStorage.getItem('token');
			if (jwt) config.headers['x-access-token'] = jwt;
			return config;
		}
	}
}

// Route authentication
function SetupRouteAuth($rootScope, $state, $window) {
	// When the state changes
	$rootScope.$on('$stateChangeStart', (event, toState) => {
		// If the state object has "auth=true"
		if (toState.auth) {
			// Prevent the state change if the user doesn't have a token.
			if (!$window.localStorage.getItem('token')) {
				event.preventDefault();
				// Redirect to landing page
				$state.transitionTo('landing');
			}
		}
	});
}