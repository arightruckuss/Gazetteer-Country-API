
<?php 

 

// next two lines for testing only



ini_set('display_errors', 'On');

error_reporting(E_ALL);



$countries = json_decode(file_get_contents('countryBorders.geo.json'),true);



$countriesParsed = [];


foreach ($countries['features'] AS $country) {

    

    $temp = [];

    $temp['code']=$country['properties']['iso_a3'];

    $temp['name']=$country['properties']['name'];

    array_push($countriesParsed, $temp);

    $object = json_decode(json_encode($temp), false);

    echo '<option>' . $object->name . '</option>';

}


usort($countriesParsed, function ($item1, $item2) {

    return $item1['name'] <=> $item2['name'];

});

$output['status']['code'] = "200";

$output['status']['name'] = "ok";

$output['status']['description'] = "success";

$output['data'] = $countriesParsed;

header('Content-Type: application/json; charset=UTF-8');

?>