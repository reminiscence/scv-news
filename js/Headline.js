function Headline(){
	var $titlebox = $('.slides_container'),
		$doc = $(document.body);

	this.title = $titlebox,
	this.doc = $doc;
}

Headline.prototype.showNewsTitle = function(){
	var newsList = config.newsList,
		str = '',
		news = [],
		randNum = 0,
		titlebox = this.title,
		doc = this.doc;

	if(newsList[0].title === undefined)
		return;

	for(var i = 0; i < 15; i++){
		randNum = Math.floor(Math.random()* newsList.length);

		str = newsList[randNum].title;
		news[i] = {};
		console.log($(window).innerWidth());
		if($(window).innerWidth() > 600)
			news[i].tit = str.substring(0, 25) + '...';
		else
			news[i].tit = str.substring(0, 10) + '...';
		news[i].vid = config.getId(newsList[randNum].videoUrl);
	}

	$.get('./jst/headline-template.jst',function(tmpl){
		$.tmpl(tmpl, news).appendTo(titlebox);
	 	$('#slides').slides({
	 		generatePagination: false,
	 		play: 9000      
		});

		titlebox.find("#rand_title").click(function(){
			config.vid = $(this).attr('vid');
			doc.trigger('clickNews');
			doc.trigger('toggleControl');
		});
	});

	
};	