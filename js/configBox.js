function ConfigBox(){
	this.doc = $(document.body);
	
}

ConfigBox.prototype.init = function(){
	var doc = this.doc,
	$configBox = $('#configbox');

	$configBox.empty();
	$.get('./jst/configbox-template.jst', function(tmpl){
		$.tmpl(tmpl).appendTo($configBox);

		$('#closeConfigBox').click(function(){
			doc.trigger('closeCB');//app.js 에 두면 작동을 안함...왜 그럴까? 질문!
						//추측1. 태그가 동적으로 만들어지므로, app.js에서 작동 안함
		});

		$('#submit-config').click(function(){
			doc.trigger('changeConfig'); //자동 재생 설정 완료.
		});
	});
};

ConfigBox.prototype.setAutoPlay = function(){
	var $active = $('.active');

	if($active.text()=="ON"){
		config.autoPlay = true;
	} else {
		config.autoPlay = false;
	}
	$active.button('toggle');
};