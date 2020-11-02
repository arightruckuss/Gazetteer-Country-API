
<?php 


//Testing
ini_set('display_errors', 'On');

error_reporting(E_ALL);

//Users location from IP Address
$users_iso3_code = file_get_contents('https://ipapi.co/' . $_SERVER[‘REMOTE_ADDR’] . '/country_code_iso3/');
$users_country = file_get_contents('https://ipapi.co/' . $_SERVER[‘REMOTE_ADDR’] . '/country_name/');
echo '<option>' . $users_country . ' ' .  $users_iso3_code . '</option>';
   

//Country boarders file contents 
$countries = json_decode(file_get_contents('countryBorders.geo.json'),true);

//New array
$countriesParsed = [];

//loop through file contents
foreach ($countries['features'] AS $country) {

    $temp = [];

    $temp['code']=$country['properties']['iso_a3'];

    $temp['name']=$country['properties']['name'];

    $temp['coords']=$country['geometry']['coordinates'];

    array_push($countriesParsed, $temp);

    $object = json_decode(json_encode($temp), false);
    
    echo '<option>' . $object->name . ' ' .  $object->code . '</option>';

}

usort($countriesParsed, function ($item1, $item2) {

    return $item1['name'] <=> $item2['name'];

});

$output['status']['code'] = "200";

$output['status']['name'] = "ok";

$output['status']['description'] = "success";

$output['data'] = $countriesParsed;

$latLng = $object->coords;

DOMDocument::getElementById('json_result').addEventListener('change', function() {
  });


?>