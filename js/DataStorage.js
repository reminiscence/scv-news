function DataStorage(){

}

DataStorage.prototype.saveData = function(){
	var bookmark = config.bookmarkList;

	var ws = new cloudmine.WebService({
	  appid: 'a53f225b5b9b465fac29085d6f98b18f',
	  apikey: '02e619ec0ee34bccb975fca744e79717'
	});

	ws.get('bookmark').on('success', function(data, response){
		if(data != null){
			ws.update('bookmark',bookmark).on('success',function(data, response){
				console.log(data,response,"success");
			});
		} else {
			ws.set('bookmark', bookmark).on('success', function(data, response){
				console.log(data, response);
			});
		}
	});

	
};

DataStorage.prototype.loadBookmarkData = function(){
	var ws = new cloudmine.WebService({
	  appid: 'a53f225b5b9b465fac29085d6f98b18f',
	  apikey: '02e619ec0ee34bccb975fca744e79717'
	});

	var length;

	ws.get('bookmark').on('success', function(data, response){
		config.bookmarkList = data.bookmark;
		length = config.bookmarkList.newsList.length;
		config.count = length;
	});
};