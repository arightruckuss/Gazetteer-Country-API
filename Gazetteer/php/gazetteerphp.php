<?php

//initialize cURL
$curl = curl_init();
curl_setopt ($curl, CURLOPT_URL, "http://api.geonames.org/countryInfoJSON?username=arightruckuss");
curl_setopt ($curl, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec ($curl);
curl_close ($curl);

$results = json_decode($result, true);// decode to associative array
$resultList = $results['geonames'];

//loops through results to print each country name
foreach($resultList as $resultLists){
    echo'<pre>';
    print_r($resultLists['countryName']);
    echo'</pre>';
}

?>
