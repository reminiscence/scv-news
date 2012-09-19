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
		bookmark = config.bookmarkList,
		count = config.count;

	$listbox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	//$listbox.html();
	$listbox.html('<div class="list-title">'+newsList[i].cpKorName+'</div><button type="button" class="close" id="closeListBox" data-dismiss="modal" aria-hidden="true">×</button>')
	$.get('./jst/news-template.jst',function(tmpl){
		for(i=0; i<length; i++){
			news = newsList[i],
			news.vid = config.getId(news.videoUrl);

			$.tmpl(tmpl, news).appendTo($listbox);
		}

		$listbox.find(".box").click(function(e){
			var $target = $(e.target),
				$box = $(this);
			if($target.attr('id') != 'btn-bookmark' && $target.attr('class') != 'icon-star-empty'){
				config.vid = $(this).attr('vid');
				doc.trigger('clickBox');
				doc.trigger('toggleControl');
			} else {
				
				FB.getLoginStatus(function (response) {
					console.log("asdf");
					console.log($box.attr('vid'));
					if(response.status === 'connected') {
						bookmark.uid = response.authResponse.userID;
						bookmark.newsList[count].vid = $box.attr('vid');
						bookmark.newsList[count].imageUrl = $box.children('img').attr('src');
						bookmark.newsList[count].title = $box.children('h5').text();
						bookmark.newsList[count].cpKorName = $box.find('span:eq(2)').text();
						bookmark.newsList[count].regDate = $box.find('span:eq(4)').text();
						config.count = count++;
						console.log(bookmark);
					} else {
						
					}
				});
			}

		});

		$('#closeListBox').click(function(){
			$('#listbox').fadeOut();
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
		});
	});
};

//
BagNews.prototype.controlView = function(){
	this.setNewsList();
	this.buildList();
};

