<?php
	header("Content-Type: application/octet-stream; charset=utf-8");

	//DB값 있나 체크(있으면 update, 없으면 insert)
	$conn = mysql_connect('localhost', 'root', '1234');
	$db = mysql_select_db('apiTest',$conn);

	if(!$db)
		echo "실패<br />";

	$sql = "select * from VideoNewsAPI";
	mysql_query("set names utf8");
	$result = mysql_query($sql);

	if(!$result)
		exit;

	$api = file_get_contents('http://media.daum.net/api/service/tv/category/all.jsonp?countPerPage=1000');
		
	$arrayApi = json_decode($api);
	$data = $arrayApi->tv->newsList->data;
	$page = $arrayApi->tv->count;

	//db값 없는 경우 insert문 실행
	if(mysql_fetch_array($result)==null)
	{
		for($i = 0; $i < $page; $i++){
			if($data[$i]->cpKorName=="MBC" ||$data[$i]->cpKorName=="SBS" ||$data[$i]->cpKorName=="YTN" ||$data[$i]->cpKorName=="MBN" ||$data[$i]->cpKorName=="연합뉴스" )
			{
				$data[$i]->title = str_replace('"', "'", $data[$i]->title);
				$sql = "insert into VideoNewsAPI values";	
				$sql = $sql."(".$data[$i]->newsId.", '".$data[$i]->cpKorName."',\"".$data[$i]->title."\", '".$data[$i]->imageUrl."', '".$data[$i]->videoUrl."', ".$data[$i]->regDate.", ".$data[$i]->regTime.")";
				mysql_query("set names utf8");
				$result = mysql_query($sql, $conn);

				if(!$result){
					exit;
				}
			}
		}
	} else {
		//db값 있는 경우, 전부 삭제 후, 새로 Insert 실행
		$sql = "delete from VideoNewsAPI";
		mysql_query("set names utf8");
		$result = mysql_query($sql,$conn);

		if(!$result){
			echo 실패."<br />";
			exit;
		}

		for($i = 0; $i < $page; $i++){
			if($data[$i]->cpKorName=="MBC" ||$data[$i]->cpKorName=="SBS" ||$data[$i]->cpKorName=="YTN" ||$data[$i]->cpKorName=="MBN" ||$data[$i]->cpKorName=="연합뉴스" )
			{	
				$data[$i]->title = str_replace('"', "'", $data[$i]->title);
				$sql = "insert into VideoNewsAPI values";	
				$sql = $sql."(".$data[$i]->newsId.", '".$data[$i]->cpKorName."',\"".$data[$i]->title."\", '".$data[$i]->imageUrl."', '".$data[$i]->videoUrl."', ".$data[$i]->regDate.", ".$data[$i]->regTime.")";
				mysql_query("set names utf8");
				$result = mysql_query($sql, $conn);

				if(!$result){
					exit;
				} 
			}
		}
	}
	/*
	$sql = "select * from VideoNewsAPI order by cpKorName";

	mysql_query("set names utf8");
		$result = mysql_query($sql,$conn);

		if(!$result){
			echo 실패1."<br />";
			exit;
		}

	*/
	mysql_close($conn);
?>