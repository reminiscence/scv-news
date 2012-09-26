$(function() {

	var $doc =$(document.body);
	
	//viewer, DL,BV 객체 생성
	var bagNewsViewer = new BagNews($doc),
		dataLoader = new DataLoader(),
		BV = new $.BigVideo(),
		selectCpBox = new SelectCpBox(),
		configBox = new ConfigBox(),
		headline = new Headline(),
		storage = new DataStorage(),
		bookmark = new Bookmark();


	//버튼 selector 선언
	var $cpButton = $('#btn-cp'),
		$articleButton = $('#btn-article'),
		$listButton = $('#btn-list'),
		$commentButton = $('#btn-comment'),
		$prevButton = $('#btn-prev'),
		$nextButton = $('#btn-next'),
		$configButton = $('#btn-config'),
		$bookmarkButton = $('#btn-bookmarkBox');


	//슬라이드 박스 pirnt
	$('#slides').fadeIn();
	
	//BV 초기화 및 데이터 로드 시작
	BV.init();
	configBox.init();

	FB.getLoginStatus(function (response) {
		if(response.status === 'connected') {
			storage.loadBookmarkData();
		}
	});
	dataLoader.loadData();
	

	//tooltip 작동(모바일 기기, 태블릿에선 작동 x)
	/*var ua = navigator.userAgent.toLowerCase(),
		isAndroid = ua.indexOf('android'),
		isIphone= ua.indexOf('iphone'),
		isIpad = ua.indexOf('ipad');
	if(isAndroid == -1 && isIphone == -1  && isIpad == -1){
		
		$cpButton.tooltip();
		$articleButton.tooltip();
		$listButton.tooltip();
		$commentButton.tooltip();
		$prevButton.tooltip();
		$nextButton.tooltip();
		$configButton.tooltip();
	}*/
	var infoToggle = true;//이벤트 발생시, toggle 통해서 제목 탭 사라지거나 나타남, list, article, bookmark는 x 버튼이 동적 추가 이므로 전역으로 넘겨줌.
	

	//event
	//뉴스사 선택 event
	$cpButton.click(function(){
		if(config.check != 0){
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#commentbox').hide();
			$('#configbox').hide();
			$('#bookmarkbox').hide();
			
			//$('#selectbox').find('#myModel').modal('show');
			
			config.check = 0;
			
		} else{
			$('#selectbox').find('#myModel').modal('hide');
			config.check = 7;
		}
	});

	//기사 보기 버튼 event
	$articleButton.click(function(){
		
		if(config.check != 1){
			$('#listbox').hide();
			$('#commentbox').hide();
			$('#configbox').hide();
			// $('#selectbox').hide();
			$('#bookmarkbox').hide();
			$('#articlebox').fadeIn();

			$('#selectbox').find('#myModel').modal('hide');
			config.check = 1;
		} else {
			$('#articlebox').fadeOut();
			config.check = 7;
		}
	});

	//뉴스 리스트 버튼 event
	$listButton.click(function(){
		if(config.check !=2){
			$('#articlebox').hide();
			$('#commentbox').hide();
			//$('#selectbox').hide();
			$('#configbox').hide();
			$('#bookmarkbox').hide();
			$('#listbox').fadeIn();
			
			$('#selectbox').find('#myModel').modal('hide');
			config.check = 2;
		}else{
			$('#listbox').fadeOut();
			config.check = 7;
		}
	});

	//소셜댓글 버튼 클릭
	$commentButton.click(function(){
		if(config.check != 3){
			$('#listbox').hide();
			$('#articlebox').hide();
			//$('#selectbox').hide();
			$('#configbox').hide();
			$('#bookmarkbox').hide();
			$('#commentbox').fadeIn();

			$('#selectbox').find('#myModel').modal('hide');
			config.check = 3;
		} else {
			$('#commentbox').fadeOut();
			config.check = 7;
		}
	});

	//화면 클릭시 메뉴들이 전부 fadeOut, 다시 클릭 시 fadeIn하도록.
	$('.vjs-tech').click(function(){
		if(infoToggle){
			$('.main').fadeOut();
			$('#big-video-control-container').fadeOut();
			$('#slides').fadeOut();
			$('#login').fadeOut();
			$('#btnbox').fadeOut();
			infoToggle = false;
		} else {
			$('.main').fadeIn();
			$('#big-video-control-container').fadeIn();
			$('#slides').fadeIn();
			$('#login').fadeIn();
			$('#btnbox').fadeIn();
			infoToggle = true;
		}
	});

	//설정 메뉴 버튼 클릭
	$configButton.click(function(){
		if(config.check != 5){
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#commentbox').hide();
			//$('#selectbox').hide();
			$('#bookmarkbox').hide();
			$('#configbox').fadeIn();


			$('#selectbox').find('#myModel').modal('hide');
			config.check = 5;
		} else {
			$('#configbox').fadeOut();
			config.check = 7;
		}
	});

	$('#closeCommentBox').click(function(){
		$('#commentbox').fadeOut();
		config.check = 7;			
	});

	//모아보기 버튼 클릭시
	$bookmarkButton.click(function(){
		if(config.check != 4){
			FB.getLoginStatus(function (response) {
				if(response.status === 'connected') {
					storage.loadBookmarkData();
				}
			});
			bookmark.showBookmarkList();
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#commentbox').hide();
			//$('#selectbox').hide();
			$('#configbox').hide();
			$('#bookmarkbox').fadeIn();


			$('#selectbox').find('#myModel').modal('hide');
			config.check = 4;
		} else {
			$('#bookmarkbox').fadeOut();
			config.check = 7;
		}
	});

	//trigger & bind event
	$doc.bind('loadedData', function(){ //뉴스 데이터 로드가 됬다면 control view 실행, 뉴스 제목만 랜덤으로 띄워주는 메소드 실행함
		bagNewsViewer.controlView();
		headline.showNewsTitle();
	});	

	//기사가 로드가 됬다면 기사를 뿌려줌
	//기사가 로드가 되었다면,  config 값들이 채워져 있으므로 뉴스사 선택 객체의 init() 을 실행하여 초기 세팅
	$doc.bind('loadedArticle', function(){
		var article = config.articleData; 
		bagNewsViewer.buildArticle(article);
		selectCpBox.init();
	});

	//뉴스 동영상에 관련된 내용들이 모두 띄워졌다면 기사를 api에서 로드
	$doc.bind('showNews',  function(){
		dataLoader.loadArticle();
	});

	//뉴스 동영상이 뿌려졌다면, 그에 관한 제목,날짜 등의 정보를 보여줌
	$doc.bind('playNewsVideo', function(){
		$('#listbox').hide();
		//$('#selectbox').hide();
		
		$('#selectbox').find('#myModel').modal('hide');
		$('#articlebox').hide();
		config.check = 7;
		bagNewsViewer.showNewsInfo();
	});

	//뉴스 데이터가 조건에 맞게 config에 세팅이 됬음. BV 객체가 동영상을 보여주는 메소드를 실행
	$doc.bind('setNewsData', function(){
		var vodUrlList = [];
		var vodUrl = config.vodUrl;
		var vidList = config.vidList;

		for(var i = 0; i < vidList.length; i++){
			vodUrlList[i] = vodUrl + vidList[i];
		}
		BV.show(vodUrlList);
	});

	//뉴스 리스트에서 기사 하나를 선택 시 -> 화면에 새로 뿌려줌
	$doc.bind('clickBox',function(){
		BV.init(); //플레이어 control bar 도 초기화
		bagNewsViewer.setNewsList(config.vid);
	});

	$prevButton.bind('click', function(){
		//$('#selectbox').hide();
		
		$('#selectbox').find('#myModel').modal('hide');
		$('#configbox').hide();
		config.check = 7;
		BV.prev();
		$doc.trigger('toggleControl');
	});

	//다음 동영상 클릭 시 -> 다음 동영상 화면 로드
	$nextButton.bind('click', function(){
		//$('#selectbox').hide();
		
		$('#selectbox').find('#myModel').modal('hide');
		$('#configbox').hide();
		config.check = 7;
		BV.next();
		$doc.trigger('toggleControl');
	});

	//뉴스사 선택 box의 x버튼을 클릭시 닫아줌
	$doc.bind('closeSB',function(){
		//$('#selectbox').fadeOut();
		
		$('#selectbox').find('#myModel').modal('hide');
		config.check = 7;
		selectCpBox.init();
	});

	//설정 box의 x버튼을 클릭시 닫아줌
	$doc.bind('closeCB',function(){
		$('#configbox').fadeOut();
		config.check = 7;
	});

	//뉴스사 선택 완료 후, 확인 버튼 클릭 시 선택한 뉴스사 데이터 로드부터 동작
	$doc.bind('changeNews',function(){
		BV.togglePlayControl();
		var cp = $('#cp-selecter').val();
		//$('#selectbox').fadeOut();
		
		$('#selectbox').find('#myModel').modal('hide');
		config.check = 7;
		dataLoader.loadData(cp);
	});

	$doc.bind('changeConfig', function(){
		configBox.setAutoPlay();
		$('#configbox').fadeOut();
		config.check = 7;
	});

	$doc.bind('toggleControl', function(){
		BV.togglePlayControl();
	});

	$doc.bind('clickNews',function(){
		$('.slides_container').empty();
		BV.init(); //플레이어 control bar 도 초기화
		bagNewsViewer.setNewsList(config.vid);
		headline.showNewsTitle(); //헤드라인 새로 뿌려줌
	});

	$doc.bind('setBookmark', function(){
		storage.saveData();
	});
});