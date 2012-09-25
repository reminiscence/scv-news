function SelectCpBox(){
	var $doc = $(document.body),
	$selectBox = $('#selectbox');

	this.doc = $doc;
	this.selectBox = $selectBox;
}

//뉴스사 선택 박스를 초기화 해줌.
SelectCpBox.prototype.init = function(cpKorName){
	var selectBox = this.selectBox,
		newsList = config.newsList,
		order = config.currentNewsOrder,
		doc = this.doc,
		that = this;

	selectBox.empty();
	console.log(cpKorName);
	$.get('./jst/selectCpBox-template.jst',function(tmpl){
		if(!cpKorName){
			$.tmpl(tmpl, newsList[order]).appendTo(selectBox);
		}else{
			newsList[order].cpKorName = cpKorName;
			$.tmpl(tmpl, newsList[order]).appendTo(selectBox);
		}

		$('.dropdown-toggle').dropdown();


		//뉴스사 선택 메뉴에서 뉴스를 선택시, 바꿔주는 역할
		$('#selectbox').on('click','.dropdown-menu a', function(e){
			e.preventDefault();
			var $children = $(e.currentTarget),
			$cpKorName = $children.text();
			that.selectCp($cpKorName);
		});

		$('#closeSelectBox').click(function(){
			doc.trigger('closeSB');//app.js 에 두면 작동을 안함...왜 그럴까? 질문!
						//추측1. 태그가 동적으로 만들어지므로, app.js에서 작동 안함
		});

		$('#submit').click(function(){
			console.log("test1");
			doc.trigger('changeNews'); //바꾼 뉴스사의 뉴스 출력
		});
	});	
};

SelectCpBox.prototype.selectCp = function(cpKorName){
	this.init(cpKorName);
};