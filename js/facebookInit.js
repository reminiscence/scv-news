window.fbAsyncInit = function() {
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});

	console.log("test");
};

(function() {
	var e = document.createElement('script'); e.async = false;
	e.src = document.location.protocol +
	'//connect.facebook.net/ko_KR/all.js';
	document.getElementById('fb-root').appendChild(e);
}());