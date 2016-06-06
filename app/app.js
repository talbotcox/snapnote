angular.module('snapnote', ['ui.router', 'ngFileUpload'])
	.config(Config)
	.factory('AttachTokens', AttachTokens)
	.run(SetupRouteAuth);

function Config($stateProvider, $urlRouterProvider,$httpProvider) {

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('landing', {
			url: '/',
			templateUrl: 'app/landing/landingV.html',
			controller: 'landingC as landingC'
		})
		.state('search', {
			url: '/search',
			templateUrl: 'app/landing/users/usersV.html',
			controller: 'usersC as usersC'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'app/profile/profileV.html',
			controller: 'profileC as profileC',
			auth: true
		})
		.state('createnote', {
			url: '/createnote',
			templateUrl: 'app/note/createnote/createnoteV.html',
			controller: 'createnoteC as createnoteC',
			auth: true
		})
		.state('note', {
			url: '/note/:id',
			templateUrl: 'app/note/noteV.html',
			controller: 'noteC as noteC',
			auth: true
		})

	$httpProvider.interceptors.push('AttachTokens');

}

function AttachTokens($window) {
	return {
		request(config) {
			var jwt = $window.localStorage.getItem('token');
			if (jwt) config.headers['x-access-token'] = jwt;
			return config;
		}
	}
}

function SetupRouteAuth($rootScope, $state, $window) {
	$rootScope.$on('$stateChangeStart', (event, toState) => {
		if (toState.auth) {
			if (!$window.localStorage.getItem('token')) {
				event.preventDefault();
				$state.transitionTo('landing');
			}
		}
	});
}