<?php
	header("Content-Type: text/html; charset=utf-8");

	//DB값 있나 체크(있으면 update, 없으면 insert)
	$conn = mysql_connect('localhost', 'root', '1234');
	$db = mysql_select_db('apiTest',$conn);

	if(!$db)
		echo "실패<br />";

	$pageCount = 0; //실제 db에 들어가는 총 개수
	//화면 출력
	if($_GET['cpKorName'] == NULL && $_GET['regDate'] == NULL){
		$sql = "select * from VideoNewsAPI";
	// } else if($_GET['cpKorName'] != NULL && $_GET['regDate'] == NULL){
	// 	$sql = "select * from VideoNewsAPI where cpKorName=\"".$_GET['cpKorName']."\"";
	} elseif ($_GET['cpKorName'] != NULL && $_GET['regDate']!=NULL) {
		$sql = "select * from VideoNewsAPI where cpKorName=\"".$_GET['cpKorName']."\" and regDate=\"".$_GET['regDate']."\"";
	} 
	mysql_query("set names utf8");
	$result = mysql_query($sql);

	if(!$result)
		exit;

	$list = array();
	$mbc = array();
	$sbs = array();
	$ytn = array();
	$mbn = array();
	$yonhap = array();
	while($tmp = mysql_fetch_array($result)){
		$cpKorName=$tmp['cpKorName'];
		$newsId=$tmp['newsId'];
		$title=$tmp['title'];
		$imageUrl=$tmp['imageUrl'];
		$videoUrl=$tmp['videoUrl'];
		$regDate=$tmp['regDate'];
		$regTime=$tmp['regTime'];
		$totalRowCount = $tmp['totalRowCount'];

		$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
		
		$list[] = $arr;

		switch ($cpKorName) {
			case 'mbc':
				$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
				$mbc[] = $arr;
				break;
			case 'sbs':
				$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
				$sbs[] = $arr;
				break;
			case 'ytn':
				$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
				$ytn[] = $arr;
				break;
			case 'mbn':
				$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
				$mbn[] = $arr;
				break;
			case 'yonhap':
				$arr = array('newsId' => $newsId, 'cpKorName'=>$cpKorName, 'title'=>urldecode($title), 'imageUrl'=>$imageUrl, 'videoUrl'=>$videoUrl, 'regDate'=>$regDate, 'regTime'=>$regTime);
				$yonhap[] = $arr;
				break;
		}
		$pageCount++;
	}
	switch($_GET['cpKorName']){
		case 'mbc':
			$newsApi['data'] = $mbc;	
			break;
		case 'sbs':
			$newsApi['data'] = $sbs;
			break;
		case 'ytn':
			$newsApi['data'] = $ytn;
			break;
		case 'mbn':
			$newsApi['data'] = $mbn;
			break;
		case 'yonhap':
			$newsApi['data'] = $yonhap;
			break;
		default :
			$newsApi['data'] = $list;
	}
	
	// $newsApi['data'] = $list;
	$newsApi['totalPageCount']=$pageCount;
	echo json_encode($newsApi);
	

	//echo $list;*/
	mysql_close($conn);
?>