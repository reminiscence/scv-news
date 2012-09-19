 window.fbAsyncInit = function() {
 	var $doc = $(window.body);
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});

	$doc.bind('checkLogin',function(){
		//console.log("asdf");
		FB.getLoginStatus(function(response) {
			if (response.session) {
				console.log("asdf");// logged in and connected user, someone you know
			} else {
				console.log("ddd");// no user session available, someone you dont know
			}
		});
	});
};

	
(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol +
	'//connect.facebook.net/ko_KR/all.js';
	document.getElementById('fb-root').appendChild(e);
}());