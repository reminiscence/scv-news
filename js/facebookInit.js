window.fbAsyncInit = function() {
	FB.init({status: true, cookie: true,
		xfbml: true});
};

(function() {
	var e = document.createElement('script'); e.async = false;
	e.src = document.location.protocol +
	'//connect.facebook.net/ko_KR/all.js';
	document.getElementById('fb-root').appendChild(e);
}());