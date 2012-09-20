function DataStorage(){

}

DataStorage.prototype.saveData = function(){
	var bookmark = config.bookmark;

	var ws = new cloudmine.WebService({
	  appid: 'a53f225b5b9b465fac29085d6f98b18f',
	  apikey: '02e619ec0ee34bccb975fca744e79717'
	});

	ws.set('bookmark', bookmark).on('success', function(data, response){
		console.log(data);
	});
};