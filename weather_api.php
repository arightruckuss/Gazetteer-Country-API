<?php

//stores postcode input from html in a variable
$postcode=$_GET['postcode'];

//initialise curl  
$curl = curl_init();


curl_setopt_array($curl,[
    CURLOPT_URL => 'http://api.weatherapi.com/v1/current.json?key=56606acedefc453cad0111125201210&q=Spain',
    CURLOPT_USERAGENT => 'Geonames API in CURL',
    CURLOPT_RETURNTRANSFER => TRUE

]);

$result = json_decode(curl_exec($curl));
$results = (array) $result;

$locationArray = $results['location'];
$locationArrays = (array) $locationArray;

$arrayLocation = $locationArrays['localtime'];

$currentArray = $results['current'];
$currentArrays = (array) $currentArray;

$arrayTemp = 'Temp: ' . $currentArrays['temp_c'] . 'C \'   /   ' ;

print_r($arrayTemp);
print_r($arrayLocation);



?>