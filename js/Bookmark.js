function Bookmark (){
	
}

Bookmark.prototype.showBookmarkList = function(){
	var bookmark = config.bookmarkList.newsList,
		length = bookmark.length,
		news = '',
		$bookmarkBox = $('#bookmarkbox');

	$bookmarkBox.empty(); //이전 항목을 지움. 새로이 불러올 항목을 $.get 부분에서 새로 뿌려줌
	$bookmarkBox.html('<div class="control_bar"><button type="button" class="close" id="closebookmarkBox" data-dismiss="modal" aria-hidden="true">×</button></div>')
	$.get('./jst/bookmark-template.jst',function(tmpl){
		for(var i =0; i < length; i++){
			news = bookmark[i];
			$.tmpl(tmpl, news).appendTo(bookmarkBox);
		}
		
		
	});		
};