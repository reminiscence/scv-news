 window.fbAsyncInit = function() {
   FB.init({appId: '347722045320000', status: true, cookie: true,
            xfbml: true});
 };
 (function() {
   var e = document.createElement('script'); e.async = true;
   e.src = document.location.protocol +
     '//connect.facebook.net/ko_KR/all.js';
   document.getElementById('fb-root').appendChild(e);
 }());