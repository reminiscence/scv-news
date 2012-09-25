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
	bookmarkList : {uid : 0, newsList : []},
	count : 0,
	toggle : false,
	getId : function getVid(videoUrl){
		return videoUrl.replace("http://flvs.daum.net/flvPlayer.swf?vid=","");
	},
	trim : function trim(str){
		str  = str.replace(/^\s*/,'').replace(/\s*$/,'');

		return str;
	}
};