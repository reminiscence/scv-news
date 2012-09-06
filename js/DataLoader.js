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
		//뉴스사 값을 api URL값에 맞게 파싱함
		cp = cp.toLowerCase();
		cp = trim(cp);

		if(cp == "연합뉴스")
			cp = "yonhap";
		else if(cp == "전체")
			cp = "category/all";
	
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

//공백 제거 함수
function trim(str){
	str  = str.replace(/^\s*/,'').replace(/\s*$/,'');

	return str;
}