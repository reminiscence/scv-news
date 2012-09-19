 function fbLoginStatus(response) {
     if(response.session) {
        console.log("success");//user is logged in, display profile div
     } else {
        console.log("failed");//user is not logged in, display guest div
     }
  }

 window.fbAsyncInit = function() {
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});

	FB.getLoginStatus(fbLoginStatus);
	FB.Event.subscribe('auth.statusChange', fbLoginStatus); 
};

	
(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = document.location.protocol +
	'//connect.facebook.net/ko_KR/all.js';
	document.getElementById('fb-root').appendChild(e);
}());