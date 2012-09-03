function BagNews(){
	var $doc = $(document.body);
	this.doc = $doc;
}

//뉴스 목록을 setting함
BagNews.prototype.setNewsList = function(vid){
	var newsList = config.newsList,
		length=newsList.length,
		news =[],
		vidList = [],
		doc = this.doc;
	config.currentNewsOrder = 0;

	if(vid){
		for(var i=0; i<length; i++){
			if(vid === getVid(newsList[i].videoUrl) ){
				for(var j = i, k = 0; j < length; j++, k++){
					news[k] = newsList[j];
					vidList[k] = getVid(news[k].videoUrl);
				}	
				break;
			}
		}
	}
	else {
		for(var i=0; i<length; i++, j++){
			news[i] = newsList[i]; //재생될 뉴스 동영상의 목록 =>news[], 전체 뉴스 동영상 목록 => newsList[]
			vidList[i] = getVid(newsList[i].videoUrl);
		}
	}

	config.vidList = vidList;
	config.news = news;
	doc.trigger('setNewsData');
};

//뉴스 정보(제목, 뉴스사, 날짜)를 보여줌
BagNews.prototype.showNewsInfo = function (){
	var doc = this.doc, 
		news = config.news,
		order = config.currentNewsOrder;
	$('#title').html(news[order].title);
	$("#cp").html(news[order].cpKorName);
	$("#date").html(news[order].regDate);
	
	config.newsId = news[order].newsId;
	doc.trigger('showNews');
};

//뉴스 목록을 구성함
BagNews.prototype.buildList = function (){
	var newsList = config.newsList,
		$listbox = $('#listbox'),
		length = newsList.length,
		i=0,
		news='',
		doc = this.doc;

	$listbox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	$.get('./jst/news-template.jst',function(tmpl){
		for(i=0; i<length; i++){
			news = newsList[i],
			news.vid = getVid(news.videoUrl);

			$.tmpl(tmpl, news).appendTo($listbox);
		}

		$listbox.find(".box").click(function(){
			config.vid = $(this).attr('vid');
			doc.trigger('clickBox');
		});
	});
};

//해당 뉴스의 기사를 구성함
BagNews.prototype.buildArticle = function(article){
	var $articlebox = $('#articlebox');
	$articlebox.empty();
	
	$.get('./jst/article-template.jst',function(tmpl){
		$.tmpl(tmpl, article).appendTo($articlebox);
	});
};

//
BagNews.prototype.controlView = function(){
	this.setNewsList();
	this.buildList();
};

function getVid(videoUrl){
	return videoUrl.replace("http://flvs.daum.net/flvPlayer.swf?vid=","");
}