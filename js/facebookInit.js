window.fbAsyncInit = function() {
	FB.init({appId: '524760984205471', status: true, cookie: true,
		xfbml: true});
};

$('#login').click(function(){
	login();
});

function login(){
	FB.login(function(response){
		LoginSuccessGo();
	});
}

function LoginSuccessGo(){
	$('#login').hide();
	$('#logout').show();
}