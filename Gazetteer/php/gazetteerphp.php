<?php

    $url = json_decode(file_get_contents('countryBorders.geo.json'));

    $feature = $url->features;

    foreach ($feature as $features){

        $cities = $features->properties->name;
        print_r($cities);
    }
?>