angular.module('snapnote')
	.controller('noteC', noteC);

function noteC(API, $stateParams) {
	var self = this;

	self.refresh = function() {
		API.getNote($stateParams.id)
			.then(response => self.note = response);
	}

	self.refresh();
}