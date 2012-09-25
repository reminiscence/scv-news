function BagNews(doc){
	this.doc = doc;
}

//뉴스 목록을 setting함
BagNews.prototype.setNewsList = function(vid){
	var newsList = config.newsList,
		length=newsList.length,
		vidList = [],
		doc = this.doc;
	config.currentNewsOrder = 0;

	if(vid){
		for(var i=0; i<length; i++){
			if(vid === config.getId(newsList[i].videoUrl) ){
				config.currentNewsOrder = i;  //클릭한 뉴스의 위치만 알아냄. 전체목록에서 클릭한 뉴스부터 뉴스 동영상이 재생됨.
				break;
			}
		}
	}

	for(var i=0; i<length; i++){
		vidList[i] = config.getId(newsList[i].videoUrl);
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
			config.listButtonToggle = false;
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
			articleButtonToggle = false;
		});
	});
};

//
BagNews.prototype.controlView = function(){
	this.setNewsList();
	this.buildList();
};

