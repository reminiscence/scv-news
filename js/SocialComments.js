function SocialComments(){
	var $commentBox = $('#commentbox'),
		$doc = $(document.body);

	this.doc = $doc,
	this.commentBox = $commentBox;
}

SocialComments.prototype.showSocialComment = function(){
	var commentBox = this.commentBox,
		doc = this.doc;

	$.get('./jst/comment-template.jst',function(tmpl){
		console.log("asdf");
		$.tmpl(tmpl).appendTo(commentBox);

		$('#closeCommentBox').click(function(){
			doc.trigger('closeCommentBox');//app.js 에 두면 작동을 안함...왜 그럴까? 질문!
						//추측1. 태그가 동적으로 만들어지므로, app.js에서 작동 안함
		});
	});

};