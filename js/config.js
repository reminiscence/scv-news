var config = {
	newsList : {},
	apiUrl : 'http://media.daum.net/api/service/tv/',
	newsId : '',
	vodUrl : 'http://rt.flvs.daum.net:8080/RTES/Redirect?vid=',
	vid : '',
	articleData : '',
	vidList : [],
	currentNewsOrder : 0,
	autoPlay : true,
	uid : 0,
	bookmarkList : {newsList : []},
	count : 0,
	check : 7,
	clickList : true,
	getId : function getVid(videoUrl){
		return videoUrl.replace("http://flvs.daum.net/flvPlayer.swf?vid=","");
	}
};