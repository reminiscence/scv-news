function BagNews(doc){
	this.doc = doc;
}

//뉴스 목록을 setting함
BagNews.prototype.setNewsList = function(vid,clickList){
	var newsList = config.newsList,
		length=newsList.length,
		vidList = [],
		doc = this.doc,
		bookmark = config.bookmarkList.newsList;
	config.currentNewsOrder = 0;

	console.log(vid, clickList);
	if(vid&&clickList == true){
		for(var i=0; i<length; i++){
			if(vid === config.getId(newsList[i].videoUrl) ){
				config.currentNewsOrder = i;  //클릭한 뉴스의 위치만 알아냄. 전체목록에서 클릭한 뉴스부터 뉴스 동영상이 재생됨.
				break;
			}
		}
	} else if(vid&&clickList == false)  {
		for(var i = 0; i < bookmark.length; i++){
			if(vid === bookmark[i].vid){
				config.currentNewsOrder = i;
				break;
			}
		}
	}

	if(clickList == true || clickList == undefined){
		for(var i=0; i<length; i++){
			vidList[i] = config.getId(newsList[i].videoUrl);
		}
	} else {
		for(var i = 0; i < bookmark.length; i++){
			vidList[i] = bookmark[i].vid;
		}
	}

	config.vidList = vidList;
	doc.trigger('setNewsData');
};

//뉴스 정보(제목, 뉴스사, 날짜)를 보여줌
BagNews.prototype.showNewsInfo = function (){
	var doc = this.doc, 
		news = config.newsList,
		order = config.currentNewsOrder;

	$('#title').html(news[order].title);
	$("#cp").html(news[order].cpKorName);
	$("#date").html(news[order].regDate);
	
	config.newsId = news[order].newsId;
	$('.newsImage').css('src',news[order].imageUrl);
	doc.trigger('showNews');
};

//뉴스 목록을 구성함
BagNews.prototype.buildList = function (){
	var newsList = config.newsList,
		$listbox = $('#listbox'),
		length = newsList.length,
		i=0,
		news='',
		doc = this.doc,
		bookmark = '',
		count = 0;
	
	$listbox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	//$listbox.html();
	$listbox.html('<div class="list-title">'+newsList[i].cpKorName+'</div><button type="button" class="close" id="closeListBox" data-dismiss="modal" aria-hidden="true">×</button>')
	$.get('./jst/news-template.jst',function(tmpl){
		for(i=0; i<length; i++){
			news = newsList[i],
			news.vid = config.getId(news.videoUrl);

			$.tmpl(tmpl, news).appendTo($listbox);
		}

		//뉴스 리스트 - box 클릭 시 클릭한 뉴스 띄워줌. 모아보기 클릭시 모아보기 항목 추가.
		$listbox.find(".box").click(function(e){
			var $target = $(e.target),
				$box = $(this);
			if($target.attr('id') != 'btn-bookmark' && $target.attr('class') != 'icon-star-empty'){
				config.vid = $(this).attr('vid');
				doc.trigger('clickBox');
				doc.trigger('toggleControl');
			} else {
				
				var list = {};
				FB.getLoginStatus(function (response) {
					if(response.status === 'connected') { //로그인 됬을 때, 모아 볼 동영상 정보 json 형태로 담아두기

						bookmark = config.bookmarkList;
						count = config.count; //이전 데이터 개수를 넣어줌.
						
						bookmark.uid = response.authResponse.userID;
						list.vid = $box.attr('vid');
						list.imageUrl = $box.children('img').attr('src');
						list.title = $box.children('h5').text();
						list.cpKorName = $box.find('span:eq(2)').text();
						list.regDate = $box.find('span:eq(4)').text();
						
						bookmark.newsList[count] = list;
						config.bookmarkList = bookmark;
						config.count = ++count;

						doc.trigger('setBookmark');
					} else { 
						//로그인 하도록 유도
						alert("로그인이 필요한 서비스입니다. 로그인해 주십시오.");
					}
				});
			}

		});

		$('#closeListBox').click(function(){
			$('#listbox').fadeOut();
			config.check = 7;
		});

		
	});
};

//해당 뉴스의 기사를 구성함
BagNews.prototype.buildArticle = function(article){
	var $articlebox = $('#articlebox');
	$articlebox.empty();
	
	$.get('./jst/article-template.jst',function(tmpl){
		$.tmpl(tmpl, article).appendTo($articlebox);

		$('#closeArticleBox').click(function(){
			$('#articlebox').fadeOut();
			config.check = 7;
		});
	});
};

BagNews.prototype.controlView = function(){
	this.setNewsList();
	this.buildList();
};

function Bookmark (){}
	this.doc = $(document.body);
}

Bookmark.prototype.showBookmarkList = function(){
	var bookmark = config.bookmarkList.newsList,
		length = 0,
		news = '',
		$bookmarkBox = $('#bookmarkbox'),
		doc = this.doc;

	if(bookmark != undefined){
		length = bookmark.length;
	}

	$bookmarkBox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	$bookmarkBox.html('<div class="list-title">Book mark</div><button type="button" class="close" id="closebookmarkBox" data-dismiss="modal" aria-hidden="true">×</button>');
	$.get('./jst/bookmark-template.jst',function(tmpl){
		for(var i =0; i < length; i++){
			news = bookmark[i];
			$.tmpl(tmpl, news).appendTo($bookmarkBox);
		}

		$bookmarkBox.find('.box').click(function(){
			config.vid = $(this).attr('vid');
			doc.trigger('clickBox');
			doc.trigger('toggleControl');
		});

		$('#closebookmarkBox').click(function(){
			$('#bookmarkbox').fadeOut();
			config.check = 7;
		});
	});	
};

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

function DataLoader(){
	var  $doc = $(document.body);

	this.apiUrl = config.apiUrl;
	this.articleUrl = config.articleUrl;
	this.doc = $doc;
	var date = new Date();
		year = date.getFullYear();
		month = date.getMonth() + 1;
		day = date.getDate();

	//오늘 날짜의 뉴스만 받아오도록 하기. 옵션에서 조절 가능
	if(month < 10){
		if(day < 10)
			this.date = year +'0'+ month+'0'+ day;
		else
			this.date = year +'0'+ month + day;
	} else {
		if(day < 10)
			this.date = year + month+'0'+ day;
		else
			this.date = year + month + day;
	}
}

//뉴스 api에서 뉴스 정보(json)를 불러오는 부분
DataLoader.prototype.loadData = function(cp){//뉴스사 값이 들어오지 않으면 default로 전체 뉴스, 뉴스사 값이 들어오면 그 뉴스사의 뉴스를 띄움
	var doc = this.doc,
		date = this.date;

	if(!cp){
		$.getJSON(this.apiUrl+'category/all.jsonp?countPerPage=300&regdate='+date+'&callback=?',function(data){
			config.newsList = data.tv.newsList.data;
			doc.trigger('loadedData');
		});
	}
	else {
		$.getJSON(this.apiUrl+cp+'.jsonp?countPerPage=300&regdate='+date+'&callback=?',function(data){
			config.newsList = data.tv.newsList.data;
			doc.trigger('loadedData');
		});
	}
};

//newsId값을 이용하여 기사를 로드함
DataLoader.prototype.loadArticle = function(){
	var newsId = config.newsId,
		doc = this.doc;
	var articleApiUrl = "http://media.daum.net/api/service/news/view.jsonp?newsId="+ newsId + "&callback=?";
	$.getJSON(articleApiUrl,function(article){
		config.articleData = article;
		doc.trigger('loadedArticle');
	});
};

function DataStorage(){

}

DataStorage.prototype.saveData = function(){
	var bookmark = config.bookmarkList;

	var ws = new cloudmine.WebService({
	  appid: 'a53f225b5b9b465fac29085d6f98b18f',
	  apikey: '02e619ec0ee34bccb975fca744e79717'
	});

	ws.set('bookmark', bookmark).on('success', function(data, response){
		console.log(data, response);
	});

};

DataStorage.prototype.loadBookmarkData = function(){
	var ws = new cloudmine.WebService({
	  appid: 'a53f225b5b9b465fac29085d6f98b18f',
	  apikey: '02e619ec0ee34bccb975fca744e79717'
	});

	var length = 0;

	var response = ws.get('bookmark');
	response.on('success', function(data, response){
		config.bookmarkList = data.bookmark;
		length = config.bookmarkList.newsList.length;
		config.count = length;
	});

	response.on('error',function(data,response){
		config.bookmarkList = {uid : 0, newsList : []};
		config.count = length;
	});
};

function Headline(){
	var $titlebox = $('.slides_container'),
		$doc = $(document.body);

	this.title = $titlebox,
	this.doc = $doc;
}

Headline.prototype.showNewsTitle = function(){
	var newsList = config.newsList,
		str = '',
		news = [],
		randNum = 0,
		titlebox = this.title,
		doc = this.doc;

	if(newsList[0].title === undefined)
		return;

	for(var i = 0; i < 15; i++){
		randNum = Math.floor(Math.random()* newsList.length);

		str = newsList[randNum].title;
		news[i] = {};
		if($(window).innerWidth() > 600)
			news[i].tit = str.substring(0, 25) + '...';
		else
			news[i].tit = str.substring(0, 10) + '...';
		news[i].vid = config.getId(newsList[randNum].videoUrl);
	}

	$.get('./jst/headline-template.jst',function(tmpl){
		$.tmpl(tmpl, news).appendTo(titlebox);
	 	$('#slides').slides({
	 		generatePagination: false,
	 		play: 9000      
		});

		titlebox.find("#rand_title").click(function(){
			config.vid = $(this).attr('vid');
			doc.trigger('clickNews');
			doc.trigger('toggleControl');
		});
	});

	
};

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

	$('#selectbox').empty();

	$.get('./jst/selectCpBox-template.jst',function(tmpl){
		if(!cpKorName){
			$.tmpl(tmpl, newsList[order]).appendTo(selectBox);
		}else{
			newsList[order].cpKorName = cpKorName;
			$.tmpl(tmpl, newsList[order]).appendTo(selectBox);
		}

		$('#closeSelectBox').click(function(){
			doc.trigger('closeSB');//app.js 에 두면 작동을 안함...왜 그럴까? 질문!
						//추측1. 태그가 동적으로 만들어지므로, app.js에서 작동 안함
		});

		$('#submit').click(function(){
			doc.trigger('changeNews'); //바꾼 뉴스사의 뉴스 출력
		});
	});	
};

SelectCpBox.prototype.selectCp = function(cpKorName){
	this.init(cpKorName);
};	