window.fbAsyncInit = function() {
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});

	FB.Event.subscribe('auth.statusChange', fbLoginStatus); 
};

	
(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol +
	'//connect.facebook.net/ko_KR/all.js';
	document.getElementById('fb-root').appendChild(e);
}());