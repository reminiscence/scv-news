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

	//cookie에 자동재생값이 있는지 얻어옴. null일 경우 default 값인 true로 설정.
	var cookie = $.cookie('autoPlay');
	console.log(typeof cookie);
	if(cookie == null){
		config.autoPlay = true;
	} else {
		if(cookie == "true"){
			config.autoPlay = true;
		} else {
			config.autoPlay = false;
			configBox.setAutoPlay(cookie);
		}
	}

	FB.getLoginStatus(function (response) {
		if(response.status === 'connected') {
			console.log(response);
			FB.api('/me', function(response) {
				$('#myName').html('<span>'+response.name+'님 환영합니다.</span>');
			});
			$('#login').hide();
			$('#logout').show();
			config.uid = response.authResponse.userID;
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
	//facebook login
	//로그인 되는 순간, 로그아웃 버튼이 나오도록 변경.
	FB.Event.subscribe('auth.login', function(response) {
		if(response.authResponse){
			FB.api('/me', function(response) {
				$('#myName').html('<span>'+response.name+'님 환영합니다.</span>');
			});
			$('#login').hide();
			$('#logout').show();
			storage.loadBookmarkData();
		}
	});

	$('#logout').click(function(){
		FB.logout(function(response) {
			$('#myName').empty();
			$('#login').show();
			$('#logout').hide();
		});
	});

	//뉴스사 선택 event
	$cpButton.click(function(){
		if(config.check != 0){
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#commentbox').hide();
			$('#bookmarkbox').hide();
			$('#more').hide();
			$('#configbox').find('#configModal').modal('hide');

			$('#selectbox').find('#selectModal').modal('show');
			
			config.check = 0;
			
		} else{
			$('#selectbox').find('#selectModal').modal('hide');
			config.check = 7;
		}
	});

	//기사 보기 버튼 event
	$articleButton.click(function(){
		
		if(config.check != 1){
			$('#configbox').find('#configModal').modal('hide');
			$('#selectbox').find('#selectModal').modal('hide');
			$('#listbox').hide();
			$('#commentbox').hide();
			$('#bookmarkbox').hide();
			$('#more').hide();
			$('#articlebox').fadeIn();

			config.check = 1;
		} else {
			$('#articlebox').fadeOut();
			config.check = 7;
		}
	});

	//뉴스 리스트 버튼 event
	$listButton.click(function(){
		if(config.check !=2){
			$('#selectbox').find('#selectModal').modal('hide');
			$('#configbox').find('#configModal').modal('hide');
			$('#articlebox').hide();
			$('#commentbox').hide();
			$('#bookmarkbox').hide();
			$('#listbox').fadeIn();
			
			config.check = 2;
			if(config.lengthCount < config.newsList.length){
				$('#more').show();
			}
		}else{
			$('#listbox').fadeOut();
			$('#more').hide();
			config.check = 7;
		}
	});

	//소셜댓글 버튼 클릭
	$commentButton.click(function(){
		if(config.check != 3){
			$('#selectbox').find('#selectModal').modal('hide');
			$('#configbox').find('#configModal').modal('hide');
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#bookmarkbox').hide();
			$('#more').hide();
			$('#commentbox').fadeIn();

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
			$('#bookmarkbox').hide();
			$('#more').hide();
			$('#selectbox').find('#selectModal').modal('hide');
			$('#configbox').find('#configModal').modal('show');
			config.check = 5;
		} else {
			$('#configbox').find('#configModal').modal('hide');
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
					config.uid = response.authResponse.userID; //uid 세팅, 모아보기 리스트 로드 시 uid를 key값으로 사용하여 데이터 가져옴.
				} else {
					config.uid = 0;
					config.bookmarkList = {newsList : []}; //로그아웃이 됬을 경우, bookmarkList와 uid 값을 초기화시켜줌.
				}
			});
			bookmark.showBookmarkList();

			$('#configbox').find('#configModal').modal('hide');
			$('#selectbox').find('#selectModal').modal('hide');
			$('#listbox').hide();
			$('#articlebox').hide();
			$('#commentbox').hide();
			$('#more').hide();
			$('#bookmarkbox').fadeIn();

			config.check = 4;
		} else {
			$('#bookmarkbox').fadeOut();
			config.check = 7;
		}
	});

	$('#more').click(function(){
		bagNewsViewer.buildList();
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
		$('#configbox').find('#configModal').modal('hide');
		$('#selectbox').find('#selectModal').modal('hide');
		$('#articlebox').hide();
		$('#bookmarkbox').hide();
		$('#commentbox').hide();
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
		var clickList = true;
		BV.init(); //플레이어 control bar 도 초기화
		bagNewsViewer.setNewsList(config.vid,clickList);
	});

	//bookmark 리스트에서 기사 하나를 선택 시 -> 화면에 새로 뿌려줌
	$doc.bind('clickBookmark',function(){
		var clickList = false;
		BV.init(); //플레이어 control bar 도 초기화
		bagNewsViewer.setNewsList(config.vid,clickList);
	});

	$prevButton.bind('click', function(){
		$('#configbox').find('#configModal').modal('hide');
		$('#selectbox').find('#selectModal').modal('hide');
		$('#listbox').hide();
		$('#articlebox').hide();
		$('#commentbox').hide();
		$('#bookmarkbox').hide();
		config.check = 7;
		BV.prev();
		$doc.trigger('toggleControl');
	});

	//다음 동영상 클릭 시 -> 다음 동영상 화면 로드
	$nextButton.bind('click', function(){
		$('#configbox').find('#configModal').modal('hide');
		$('#selectbox').find('#selectModal').modal('hide');
		$('#listbox').hide();
		$('#articlebox').hide();
		$('#commentbox').hide();
		$('#bookmarkbox').hide();
		config.check = 7;
		BV.next();
		$doc.trigger('toggleControl');
	});

	//뉴스사 선택 box의 x버튼을 클릭시 닫아줌
	$doc.bind('closeSB',function(){
		$('#selectbox').find('#selectModal').modal('hide');
		config.check = 7;
		selectCpBox.init();
	});

	//설정 box의 x버튼을 클릭시 닫아줌
	$doc.bind('closeCB',function(){
		$('#configbox').find('#configModal').modal('hide');
		config.check = 7;
	});

	//뉴스사 선택 완료 후, 확인 버튼 클릭 시 선택한 뉴스사 데이터 로드부터 동작
	$doc.bind('changeNews',function(){
		BV.togglePlayControl();
		var cp = $('#cp-selecter').val();

		$('#selectbox').find('#selectModal').modal('hide');
		config.check = 7;
		config.lengthCount = 0; //뉴스 리스트 카운트 개수 초기화.

		if(cp === 'all'){
			dataLoader.loadData();
		} else {
			dataLoader.loadData(cp);
		}
		
	});

	$doc.bind('changeConfig', function(){
		configBox.setAutoPlay();
		$('#configbox').find('#configModal').modal('hide');
		config.check = 7;
	});

	$doc.bind('toggleControl', function(){
		BV.togglePlayControl();
	});

	$doc.bind('clickNews',function(){
		var clickList = true;
		$('.slides_container').empty();
		BV.init(); //플레이어 control bar 도 초기화
		bagNewsViewer.setNewsList(config.vid, clickList);
		headline.showNewsTitle(); //헤드라인 새로 뿌려줌
	});

	$doc.bind('reShowBookmark', function(){
		bookmark.showBookmarkList();
		storage.saveData();
	});

	$doc.bind('setBookmark', function(){
		storage.saveData();
	});
});