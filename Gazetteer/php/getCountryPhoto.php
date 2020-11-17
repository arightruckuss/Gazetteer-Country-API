<?php

	$executionStartTime = microtime(true) / 1000;

	$url='https://pixabay.com/api/?key=19151156-3e49e08a7941909cfa24bbdc0&image_type=photo&pretty=true&q=' . $_REQUEST['country'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $decode['hits'];
	
	header('Content-Type: application/json; charset=UTF-8');
	header("Access-Control-Allow-Origin: *");
    echo json_encode($output); 
    

?>