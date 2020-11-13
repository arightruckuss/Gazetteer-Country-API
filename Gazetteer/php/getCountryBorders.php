<?php

//Testing
ini_set('display_errors', 'On');

error_reporting(E_ALL);
   
//Country boarders file contents 
$countries = json_decode(file_get_contents('countryBorders.geo.json'),true);

//New array
$countriesParsed = [];

//loop through file contents
foreach ($countries['features'] AS $country) {

    $temp = [];

    $temp['code']=$country['properties']['iso_a3'];

    $temp['name']=$country['properties']['name'];
    
    $temp['geometry']=$country['geometry']['coordinates'];

    array_push($countriesParsed, $temp);

}

usort($countriesParsed, function ($item1, $item2) {

    return $item1['name'] <=> $item2['name'];

});

$output['status']['code'] = "200";

$output['status']['name'] = "ok";

$output['status']['description'] = "success";

$output['data'] = $countriesParsed;

header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Origin: *");

echo json_encode($output);

?>
