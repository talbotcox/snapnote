angular.module('snapnote')
	.controller('noteC', noteC);

function noteC(API, $stateParams) {
	var self = this;


	function scrollContainer() {
		var timeoutId;
		timeoutId = setTimeout(function() {
			clearTimeout(timeoutId);
			self.commentContainer = self.commentContainer || document.querySelector('#commentContainer');
			if (self.commentContainer) {
				self.commentContainer.scrollTop = self.commentContainer.scrollHeight - self.commentContainer.clientHeight;
			}
		}, 100);
	}


	self.refresh = function() {
		API.getNote($stateParams.id)
			.then(response => {
				self.note = response;
			});
	}
	
	
	self.refreshComments = function() {
		
		
		API.getCommentsByNoteId($stateParams.id)
			.then(response => {
				self.comments = response;
				scrollContainer();
			});
	}
	
	self.deleteComment = function(id) {
		API.deleteComment(id).then((res)=> {
			self.refreshComments();
		})
	}
	
	
	self.addComment = function() {
		self.input = self.input || document.querySelector('#commentInput');
		
		var comment = {
			text: self.input.value,
			name: API.ls.get('name'),
			noteId: self.note.id
		}
		API.addComment(comment).then(comment => {
			console.log(comment)
			self.refreshComments();
			self.input.value = "";
		})
	}
	
	self.refresh();
	self.refreshComments();
}