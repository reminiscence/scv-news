function Bookmark (){
	
}

Bookmark.prototype.showBookmarkList = function(){
	var bookmark = config.bookmarkList.newsList,
		length = 0,
		news = '',
		$bookmarkBox = $('#bookmarkbox');

	if(bookmark != undefined){
		length = bookmark.length;
	}

	$bookmarkBox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	$bookmarkBox.html('<div class="list-title">'+bookmark[i].cpKorName+'</div><button type="button" class="close" id="closebookmarkBox" data-dismiss="modal" aria-hidden="true">×</button>')
	/*$.get('./jst/bookmark-template.jst',function(tmpl){
		for(var i =0; i < length; i++){
			news = bookmark[i];
			$.tmpl(tmpl, news).appendTo($bookmarkBox);
		}

		$('#closebookmarkBox').click(function(){
			$('#bookmarkbox').fadeOut();
			config.check = 7;
		});
	});*/

		//뉴스 리스트 - box 클릭 시 클릭한 뉴스 띄워줌. 모아보기 클릭시 모아보기 항목 추가.
		$listbox.find(".box").click(function(e){
			var $target = $(e.target),
				$box = $(this);
			if($target.attr('id') != 'btn-bookmark' && $target.attr('class') != 'icon-star-empty'){
				config.vid = $(this).attr('vid');
				doc.trigger('clickBox');
				doc.trigger('toggleControl');
			} else {
				
				var list = {};
				FB.getLoginStatus(function (response) {
					if(response.status === 'connected') { //로그인 됬을 때, 모아 볼 동영상 정보 json 형태로 담아두기

						bookmark = config.bookmarkList;
						count = config.count; //이전 데이터 개수를 넣어줌.
						
						bookmark.uid = response.authResponse.userID;
						list.vid = $box.attr('vid');
						list.imageUrl = $box.children('img').attr('src');
						list.title = $box.children('h5').text();
						list.cpKorName = $box.find('span:eq(2)').text();
						list.regDate = $box.find('span:eq(4)').text();
						
						bookmark.newsList[count] = list;
						config.bookmarkList = bookmark;
						config.count = ++count;

						doc.trigger('setBookmark');
					} else { 
						//로그인 하도록 유도
						alert("로그인이 필요한 서비스입니다. 로그인해 주십시오.");
					}
				});
			}
		});

		$('#closeListBox').click(function(){
			$('#listbox').fadeOut();
			config.check = 7;
		});

		
	});		
};