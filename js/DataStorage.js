function DataStorage(){

}

DataStorage.prototype.saveData = function(){
	var bookmark = config.bookmark;

	var ws = new cloudmine.WebService({
	  appid: '2e14ded867674f45b17a674eea31ad00',
	  apikey: 'e1ff58f5b1634eff928f7c895388c57f'
	});

	ws.set(bookmark).on('success', function(data, response){
		console.log(data);
	});
};