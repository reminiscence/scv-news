$(function() {

    var BV = new $.BigVideo({controls:false}),
        newsList = {},
        apiUrl = 'http://media.daum.net/api/service/tv/category/all.jsonp?countPerPage=300&callback=?',
        vodUrl = 'http://rt.flvs.daum.net:8080/RTES/Redirect?vid=',
        $listbox = $('#listbox');


    function random (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function getVid(videoUrl){
        return videoUrl.replace("http://flvs.daum.net/flvPlayer.swf?vid=","");
    }
    function showBigNews(vid){
        var length=newsList.length,
            news ='';

        if(vid){

            for(var i=0; i<length; i++){

                if(vid === getVid(newsList[i].videoUrl) ){
                    news = newsList[i];
                    break;
                }
            }
        }
        else {
            news = newsList[random(0, length)];
            vid = getVid(news.videoUrl);
        }


        BV.show(vodUrl+vid);
        $('#title').html(news.title);
    }
    function buildList(){
        var length = newsList.length,
            i=0,
            news='';

        for(i=0; i<length; i++){
            news = newsList[i],
            news.vid = getVid(news.videoUrl);

            $("#news-template").tmpl(news).appendTo($listbox);
        }

        $listbox.find(".box").click(function(){

            var vid = $(this).attr('vid');
            showBigNews(vid);
        });


        // $listbox.imagesLoaded(function(){

        //     $listbox.masonry({
        //       itemSelector: '.box'
        //     }); 
        // });
    }

    function loadData(){
        $.getJSON(apiUrl,function(data){

            newsList = data.tv.newsList.data;
            showBigNews();
            buildList();
        });
    }


    BV.init();
    loadData();


    //tooltip
    // $('.btnbox a').tooltip({placement:'botton'});

    //list modal
    // $('#listbox').modal('hide');


    //event
    $('#btn-refresh').click(function(){
        showBigNews();
    });

    $('#btn-list').click(function(){
        $listbox.fadeIn();
    });

    $listbox.click(function(){
        $listbox.hide();
    });
});