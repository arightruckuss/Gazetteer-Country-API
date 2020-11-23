//initialize map and layer
tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}),
	latlng = L.latLng(52, 6);

var map = L.map('map', {zoomControl: false, center: latlng, zoom: 2, layers: [tiles]});

var mapBaselayers = {
    "Satellite Map": L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd'),
    "White Map": L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Black Map": L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'), 
    "Colors Map": L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
};

L.control.layers(mapBaselayers, null, {position: 'bottomleft'}).addTo(map);

var shadeBaselayers = {
    "Hill Shade": L.tileLayer('https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Rain Clouds": L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Cloud Cover": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Land Temp": L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593')
}

L.control.layers(shadeBaselayers, null, {position: 'topright'}).addTo(map);

//Dropdown country list
$.getJSON('php/getCountryList.php', function(data) {
    $('#countryList').html('');
    for(var i = 0; i < data['data'].length; i++) {
        names = data['data'][i]['name'];
        code = data['data'][i]['code'];
        $('#countryList').append($('<option value='+ code +'>' + names + '</option>'));
        }});

//AJAX calls to PHP files
$('#countryList').ready(function() {
        //Find current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        latit = position.coords.latitude;
        longit = position.coords.longitude;

        var homeIcon = L.icon({
            iconUrl: 'images/home_location.png',
            iconSize:     [60, 60],

        })
        var latLon = L.latLng(latit, longit);
        var bounds = latLon.toBounds(5000000); // 500 = metres
        map.panTo(latLon).fitBounds(bounds);
        var home = L.marker([latit, longit], {icon: homeIcon}).bindTooltip("Home Sweet Home!").addTo(map);

$('#worldIcon').click(function(){
    map.setView([latit, longit], 3);
    $("#countryInfo").toggle();
    $("#worldIcon").toggle();
});

$('#countryList').click(function(){
    $("#countryInfo").css("display", "block")
    $("#worldIcon").css("display", "block")
});

$.ajax({
    url: "php/getUsersCountryCode.php",
    type: 'POST',
    dataType: 'json',
    success: function(result) {

        if (result.status.name == "ok") {
            $usersCountryCode = result['data']['countryCode'];
            $usersCountryName = result['data']['countryName'];
             
$.ajax({
    url: "php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $usersCountryCode,
    },
    success: function(result) {

        if (result.status.name == "ok") {
            $countryISO2 = result['data']['alpha2Code'];
            $capital = result['data']['capital'];
            console.log($capital);
            $population = result['data']['population'];
            $language = result['data']['languages'][0]['name'];
            $continent = result['data']['region'];

$.ajax({
    url: "php/getCountryPhoto.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $usersCountryName,
    },
    success: function(result) {

        if (result.status.name == "ok") {
            $photo1 = result['data'][0]['webformatURL'];

var usersCountryInfo = '<h5>Your Location <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Country: '
+ $usersCountryName + '</p><p>Capital: ' + $capital + '</p><p>Population: ' + $population + '</p><p>Continent: ' + $continent + '</p><p>Language: ' + $language + '</p><img class="photos" src="'
+ $photo1 + '"/>';

$('#countryIcon').html('<img id="flag" src="https://www.countryflags.io/' + $usersCountryCode + '/flat/64.png"/>')
                    
$(document).ready(function(){
    var new_marker =  L.marker([latit, longit], {icon: homeIcon}).bindPopup(usersCountryInfo).addTo(map);
    new_marker.openPopup();
    new_marker.openPopup();
    $('#countryList').click(function(){
        map.removeLayer(new_marker);
    }); 
}); 

        }}});
        }}});
        }}});
    })};

    $('#countryList').change(function() {
        console.log('click'); 
        $listCountryCode = $("#countryList").val();
        $listCountryTxt = $("#countryList").text(); 
        $.ajax({
            url: "php/getCountryList.php",
            type: 'POST',
            dataType: 'json',
            success: function(result) {
                if (result.status.name == "ok") {
                    for(var i = 0; i <result['data'].length; i++){
                        if(result['data'][i]['code'] == $listCountryCode){
                            $countryName = result['data'][i]['name'];
                            $countryCode = result['data'][i]['code'];
        
        $.ajax({
            url: "php/getLocationLatLng.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryCode,
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    $countryLat = result['data'][1][0]['latitude'];
                    $countryLng = result['data'][1][0]['longitude'];
                    
                    var locationMarker = L.icon({
                        iconUrl: 'images/location_marker.png',
                        iconSize:     [60, 60],
                        iconAnchor:   [30, 60],
                        popupAnchor: [2,-40],
                    });

                    var marker = L.marker([$countryLat, $countryLng], {icon: locationMarker}).addTo(map);
                    map.panTo(new L.LatLng($countryLat, $countryLng));
                    
                    map.on('move', function (e) {
                        if (marker) {
                        map.removeLayer(marker);
                        }
                        marker = L.marker([$countryLat, $countryLng], {icon: locationMarker}).addTo(map);
                        $('#countryList').click(function(){
                            map.removeLayer(marker);
                        });  
                    })

        $.ajax({
            url: "php/getCountryBorders.php",
            type: 'POST',
            dataType: 'json',
            data: {
                countryCode: $countryCode,
            },
            success: function(result) {
                if (result.status.name == "ok") {
                    
                    $borders = result['data'];

                    var border = L.geoJSON($borders, {
                        "color": "#e1ad01",
                        "weight": 5,
                        "opacity": 0.65
                    }).addTo(map);

                    map.on('move', function (e) {
                        if (border) {
                        map.removeLayer(border);
                        }
                        border = L.geoJSON($borders, {
                            "color": "#e1ad01",
                            "weight": 5,
                            "opacity": 0.65
                        }).addTo(map);

                    })

                    var countryBorderMarkers = new L.markerClusterGroup({ singleMarkerMode: true});

                    countryBorderLayer = countryBorderMarkers.addLayer(border);

                    var borders = L.featureGroup([countryBorderLayer]).addTo(map);
                    
                    map.fitBounds(borders.getBounds())

            }},
            error: function(jqXHR, textStatus, errorThrown) {
            }});
            

        $.ajax({
            url: "php/getCountryInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryCode,
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    $countryISO2 = result['data']['alpha2Code'];
                    $capital = result['data']['capital'];
                    $population = result['data']['population'];
                    $language = result['data']['languages'][0]['name'];
                    $continent = result['data']['region'];
                    $timeZones = result['data']['timezones'];
                    $currencyName = result['data']['currencies'][0]['name'];
                    $currencyCode = result['data']['currencies'][0]['code'];
                    $currencySymbol = result['data']['currencies'][0]['symbol'];
        
                    
        $.ajax({
            url: "php/getWeatherInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryCode,
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    $tempC = result['data']['temp_c'];
                    $humidity = result['data']['humidity'];
                    $condition = result['data']['condition']['text'];
                    $windMPH = result['data']['wind_mph'];
        
        $.ajax({
            url: "php/getAstronomyInfo.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryCode,
            },
            success: function(result) {

                if (result.status.name == "ok") {
                    $sunRise = result['data']['astro']['sunrise'];
                    $sunSet = result['data']['astro']['sunset'];
                    $moonRise = result['data']['astro']['moonrise'];
                    $moonSet = result['data']['astro']['moonset'];
                    $moonPhase = result['data']['astro']['moon_phase'];

            $.ajax({
                url: "php/getCovidByCountry.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: $countryName,
                },
                success: function(result) {
        
                    if (result.status.name == "ok") {
                        $covidTodayCases = result['data']['todayCases'];
                        $covidTodayDeaths = result['data']['todayDeaths'];
                        $covidActive = result['data']['active'];
                        $covidTotalCases = result['data']['cases'];
                        $covidTotalDeaths = result['data']['deaths'];


            $.ajax({
                url: "php/getCovidWorldTotal.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: $countryName,
                },
                success: function(result) {
        
                    if (result.status.name == "ok") {
                        $covidTotalConfirmed = result['data']['TotalConfirmed'];
                        $covidTotalDead = result['data']['TotalDeaths'];
                        $covidTotalRecovered = result['data']['TotalRecovered'];

            $.ajax({
                url: "php/getCountryNews.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: $countryISO2,
                },
                success: function(result) {
                    $('#txtNews').html('No Headlines Avaliable');
                    if (result.status.name == "ok") {
                        if(result['data']['hits'][0] != undefined){
                                $headline1 = result['data']['hits'][0]['title'];
                                $headline2 = result['data']['hits'][1]['title'];
                                $headline3 = result['data']['hits'][2]['title'];
                            } else {
                                $headline1 = "N/A"
                                $headline2 = "N/A"
                                $headline3 = "N/A"
                        }
            $.ajax({
                url: "php/getCountryPhoto.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: $countryName,
                },
                success: function(result) {
        
                    if (result.status.name == "ok") {
                        $photo1 = result['data'][0]['webformatURL'];
                        $photo2 = result['data'][1]['webformatURL'];
                        $photo3 = result['data'][2]['webformatURL'];
                        $photo4 = result['data'][3]['webformatURL'];
                        $photo5 = result['data'][4]['webformatURL'];
                        $photo6 = result['data'][5]['webformatURL'];

                        var countryInfo = '<h5>' + $countryName + ' <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Capital: '
                        + $capital + '</p><p>Population: ' + $population + '</p><p>Continent: ' + $continent + '</p><p>Language: ' + $language + '</p><img class="photos" src="'
                        + $photo1 + '"/>';

                        var weatherInfo = '<h5>Weather <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Temp C: '
                        + $tempC + '</p><p>Humidity: ' + $humidity + '</p><p>Wind Speed MPH: ' + $windMPH + '</p><p>Condition: ' + $condition + '</p><img class="photos" src="'
                        + $photo2 + '"/>';

                        var astronomyInfo = '<h5>Astronomy <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Sun Rise: '
                        + $sunRise + '</p><p>Sunset: ' + $sunSet + '</p><p>Moonrise: ' + $moonRise + '</p><p>Moonset: ' + $moonSet + '</p><p>Moon Phase: ' + $moonPhase + '</p><img class="photos" src="'
                        + $photo3 + '"/>';

                        var currencyInfo = '<h5>Currency <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Currency Name: '
                        + $currencyName + '</p><p>Currency Code: ' + $currencyCode + '</p><p>Currency Symbol: ' + $currencySymbol + '</p><img class="photos" src="'
                        + $photo4 + '"/>';

                        var newsInfo = '<h5>News <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Headline 1: '
                        + $headline1 + '</p><p>Headline 2: ' + $headline2 + '</p><p>Headline 3: ' + $headline3 + '</p><img class="photos" src="'
                        + $photo5 + '"/>';

                        var covidInfo = '<h5>News <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/></h5><p>Today Cases: '
                        + $covidTodayCases + '</p><p>Today Deaths: ' + $covidTodayDeaths + '</p><p>Currently Active: ' + $covidActive + '</p><p>Total Cases: ' 
                        + $covidTotalCases + '</p><p>Total Deaths: ' + $covidTotalDeaths + '</p><img class="photos" src="'
                        + $photo6 + '"/>';

                        $('#countryIcon').html('<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/>')
                        
                        $(document).ready(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).addTo(map);
                            new_marker.openPopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            }); 
                        }); 

                        $('#countryIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).addTo(map);
                            new_marker.openPopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                        });

                        $('#weatherIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(weatherInfo).openPopup().addTo(map);
                            new_marker.closePopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                        });

                        $('#astronomyIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(astronomyInfo).openPopup().addTo(map);      
                            new_marker.closePopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                        });

                        $('#currencyIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(currencyInfo).openPopup().addTo(map);
                            new_marker.closePopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                            });

                        $('#newsIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(newsInfo).openPopup().addTo(map);
                            new_marker.closePopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                            });

                        $('#covidIcon').click(function(){
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(covidInfo).openPopup().addTo(map);
                            new_marker.closePopup();
                            new_marker.openPopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                            });
                        //Wonders of the world
                        $('#worldIcon').click(function(){
                            map.setView([$countryLat, $countryLng], 3);
                            var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).openPopup().addTo(map);
                            new_marker.openPopup();
                            new_marker.closePopup();
                            $('#countryList').click(function(){
                                map.removeLayer(new_marker);
                            });  
                            $("#countryInfo").toggle();
                            $("#worldIcon").toggle();
                        });                 
                    }},});
                    }},});
                    }},});
                    }},});
                    }},});
                    }},});
                    }},});
                    }},});
             
    }}}},       
    }); 
    });
});

var cluster_markers = new L.markerClusterGroup({singleMarkerMode: true});

var	burguete = L.marker([42.9905, -1.3355]).bindPopup('<img id="burguete" class="camino_pics" src="images/burguete.jpeg"/>').bindTooltip('Burguete');
var	pamploma = L.marker([42.8125, -1.6458]).bindPopup('<img id="pamploma" class="camino_pics" src="images/pamploma.jpeg"/>').bindTooltip('Pamploma');
var	fromista_church = L.marker([42.26667, -4.40694]).bindPopup('<img id="fromista_church" class="camino_pics" src="images/fromista_church.jpeg"/>').bindTooltip('Fromista Church');
var camino_points= [burguete, pamploma, fromista_church];
var city = L.layerGroup([burguete, pamploma, fromista_church]);
camino_points = cluster_markers.addLayer(city);

var mammoth_cave = L.marker([37.1815, -86.1505]).bindPopup('<img id="mammoth_cave" class="wonder_pics" src="images/mammoth_cave.jpg"/>').bindTooltip('Mammoth Cave National Park.');
var	niagara_falls = L.marker([43.0962, -79.0377]).bindPopup('<img id="niagara_falls" class="wonder_pics" src="images/niagara-falls.jpeg"/>').bindTooltip('Niagara Falls');
var	statue_of_liberty = L.marker([40.6892, -74.0445]).bindPopup('<img id="statue_of_liberty" class="wonder_pics" src="images/statue_of_liberty.jpeg"/>').bindTooltip('Niagara Falls');
var nAmericaWonders = [mammoth_cave, niagara_falls, statue_of_liberty];
var cities = L.layerGroup([mammoth_cave, niagara_falls, statue_of_liberty]);
nAmericaWondersMarkers = cluster_markers.addLayer(cities);

var border = L.featureGroup([nAmericaWondersMarkers]).addTo(map);
var borders = L.featureGroup([camino_points]).addTo(map);



var caminoPoints = [
    [42.8782, -8.5448],
    [42.7078, -7.0436],
    [42.4590, -5.8830],
    [42.3710, -5.0299],
    [42.26667, -4.40694],
    [42.3440, -3.6969],
    [42.6722, -1.7615], 
    [42.9905, -1.3355],
    [43.16222, -1.23722],
  ]; 

var polyline = L.polyline(caminoPoints).addTo(map);  

$(map).on("click", function() {
	$("#countryInfo").toggle();
	$("#worldIcon").toggle();
    });

$('body').append('<div style="" id="loadingDiv"><img id="loading-image" src="images/ajax-loader.gif" alt="Loading..." /></div></div>');
$(window).on('load', function(){
    setTimeout(removeLoader, 4000); //wait for page load PLUS two seconds.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
        // fadeOut complete. Remove the loading div
        $( "#loadingDiv" ).remove(); //makes page more lightweight 
    });  
}