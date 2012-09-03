$(function() {

	var $doc =$(document.body);
	
	//viewer, DL,BV 객체 생성
	var bagNewsViewer = new BagNews();
	var DL = new DataLoader();
	var BV = new $.BigVideo();
	var SV = new SelectCpBox();
	BV.init();

	DL.loadData();

	var toggle = true; //이벤트 발생시, toggle 통해서 제목 탭 사라지거나 나타남

	//event
	//뉴스사 선택 event
	$('#btn-cp').click(function(){
		$('#selectbox').fadeIn();
	});

	//기사 보기 버튼 event
	$('#btn-article').click(function(){
		$('#articlebox').fadeIn();
	});

	$('#articlebox').click(function(){
		$('#articlebox').fadeOut();
	});

	//뉴스 리스트 버튼 event
	$('#btn-list').click(function(){
		$('#listbox').fadeIn();
	});

	$('#listbox').click(function(){
		$('#listbox').fadeOut();
	});

	$('video').click(function(){
		if(toggle){
			$('.main').fadeOut();
			toggle = false;
		} else {
			$('.main').fadeIn();
			toggle = true;
		}
	});

	$('#btn-config').click(function(){

	});

	//trigger & bind event
	$doc.bind('loadedData', function(){ //뉴스 데이터 로드가 됬다면 control view 실행
		bagNewsViewer.controlView();
	});	

	//기사가 로드가 됬다면 기사를 뿌려줌
	//기사가 로드가 되었다면,  config의 값들이 채워져 있으므로 뉴스사 선택 객체의 init() 을 실행하여 초기 세팅
	$doc.bind('loadedArticle', function(){

		var article = config.articleData; 
		bagNewsViewer.buildArticle(article);
		SV.init();
	});

	//뉴스 동영상에 관련된 내용들이 모두 띄워졌다면 기사를 api에서 로드
	$doc.bind('showNews',  function(){
		DL.loadArticle();
	});

	//뉴스 동영상이 뿌려졌다면, 그에 관한 제목,날짜 등의 정보를 보여줌
	$doc.bind('playNewsVideo', function(){
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
		bagNewsViewer.setNewsList(config.vid);
	});

	$('#btn-prev').bind('click', function(){
		BV.prev();
	});

	//다음 동영상 클릭 시 -> 다음 동영상 화면 로드
	$('#btn-next').bind('click', function(){
		BV.next();
	});

	//뉴스사 선택 box의 x버튼을 클릭시 닫아줌
	$doc.bind('close',function(){
		$('#selectbox').fadeOut();
		SV.init();
	});

	//뉴스사 선택 메뉴에서 뉴스를 선택시, 바꿔주는 역할
	$('#selectbox').on('click','.dropdown-menu a' ,function(e){
		e.preventDefault();
		var $children = $(e.currentTarget);
		$cpKorName = $children.text();
		SV.selectCp($cpKorName);
	});

	$doc.bind('changeNews',function(){
		var cp = $('#selectbox').find('#dLabel').text();
		$('#selectbox').fadeOut();
		DL.loadData(cp);
	});
});