window.fbAsyncInit = function() {
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});
};

(function() {
	$doc = $(document.body);
	$doc.bind('clickLogin', function(){
		FB.login(function(response) {
			if (response.session) {
				console.log("login success");
				$('#logout').show();
				$('#login').hide();
			} else {
				console.log("login  cancel");
			}
		});
	});
}());