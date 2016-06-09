angular.module('snapnote')
	.controller('userC', userC);

function userC(API, $stateParams, $location, $scope) {
	var self = this;

	self.refresh = function() {
		API.getNotes($stateParams.username)
			.then(notes => self.notes = notes)
	}
	
	self.navigate = function(event) {
		console.log($location)
		window.location.hash = event.target.getAttribute("href")
	}
	
	window.createNotesChangedListener(()=> {
		console.log('Refreshing Notes')
		self.refresh();
	})
		

	self.refresh();
}



window.createNotesChangedListener = function(callback) {
	
	if (window.notesChangedListener) {
		document.removeEventListener('notes-changed', window.notesChangedListener);
	}
	
	window.notesChangedListener = (event)=> {
		callback();
	}
	
	document.addEventListener('notes-changed', window.notesChangedListener);
}

