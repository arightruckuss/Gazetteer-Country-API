//initialize map and layer
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}),
	latlng = L.latLng(50.5, 30.51);

var map = L.map('map', {zoomControl: false, center: latlng, zoom: 2, layers: [tiles]});

//Find current location
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
	latit = position.coords.latitude;
	longit = position.coords.longitude;
	var homeIcon = L.icon({
		iconUrl: 'images/home_location.png',
		iconSize:     [60, 60],
		iconAnchor:   [30, 60],
	})

	var home = L.marker([latit, longit], {icon: homeIcon}).bindTooltip("Home Sweet Home!").addTo(map);
	
	/*map.panTo(new L.LatLng(latit, longit));
	var offset = map.getSize().x*-0.20;
	map.panBy(new L.Point(-offset, 0), {animate: false});*/
})};

//Map layers
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
        value = data['data'][i]['code'];
        $('#countryList').append($('<option value='+ value +'>' + names + '</option>'));
        }});

$(map).on("click", function() {
	$("#countryInfo").toggle();
	$("#wondersIcon").toggle();
	});

//AJAX calls to PHP files
$(document).change(function() {
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
				var bounds = [[54.559322, -5.767822]];

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
                $('#txtCountry').html($countryName  + ' <img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
                $('#txtnativeName').html(result['data']['nativeName']);
                $capital = result['data']['capital'];
                $population = result['data']['population'];
                $language = result['data']['languages'][0]['name'];
                $continent = result['data']['region'];
                $('#txtSubRegion').html(result['data']['subregion']);
                $('#txtAlpha2Code').html(result['data']['alpha2Code']);
                $('#txtAlpha3Code').html(result['data']['alpha3Code']);
                $timeZones = result['data']['timezones'];
                $('#txtDialCode').html(result['data']['callingCodes']);
                $('#txtCurrency').html('Currency '  + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
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
                $('#txtWeather').html('Weather ' + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
                $tempC = result['data']['temp_c'];
                $('#txtTempF').html(result['data']['temp_f']);
                $humidity = result['data']['humidity'];
                $condition = result['data']['condition']['text'];
                $windMPH = result['data']['wind_mph'];
                $('#txtWindKPH').html(result['data']['wind_kph']);
                $('#txtFeelC').html(result['data']['feelslike_c']);
                $('#txtFeelF').html(result['data']['feelslike_f']);
    
    $.ajax({
        url: "php/getAstronomyInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $countryCode,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $('#txtAstronomy').html('Astronomy ' + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
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
					
					function countryPopUp() {
						var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).openPopup().addTo(map);
                        marker.closePopup();
                        marker.openPopup();
                      };

					$('#countryIcon').html('<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/>')
					
					countryPopUp()

					$('#countryIcon').click(function(){
						var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).openPopup().addTo(map);
                        marker.closePopup();
						marker.openPopup();
                      });

                    $('#weatherIcon').click(function(){
                        var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(weatherInfo).openPopup().addTo(map);
                        marker.closePopup();
						marker.openPopup();
                      });

                    $('#astronomyIcon').click(function(){
                    var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(astronomyInfo).openPopup().addTo(map);      
                        marker.closePopup();
						marker.openPopup();
                    });

                    $('#currencyIcon').click(function(){
                        var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(currencyInfo).openPopup().addTo(map);
                        marker.closePopup();
						marker.openPopup();
                        });

                    $('#newsIcon').click(function(){
                        var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(newsInfo).openPopup().addTo(map);
                        marker.closePopup();
						marker.openPopup();
                        });

                    $('#covidIcon').click(function(){
                        var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(covidInfo).openPopup().addTo(map);
                        marker.closePopup();
						marker.openPopup();
						});
					//Wonders of the world
					$('#wondersIcon').click(function(){
						marker.closePopup();
						map.setView([0, 0], 2);
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

var clusterMarker = L.icon({
    iconUrl: 'images/location_marker.png',
    iconSize:     [60, 60],
    iconAnchor:   [30, 60],
    popupAnchor: [2,-40],
});

var markers = new L.markerClusterGroup({ singleMarkerMode: true, icon: clusterMarker});

var mammoth_cave = L.marker([37.1815, -86.1505]).bindPopup('<img id="mammoth_cave" src="images/mammoth_cave.jpg" width="200" height="200"/>').bindTooltip('Mammoth Cave National Park.');
var	niagara_falls    = L.marker([43.0962, -79.0377]).bindPopup('<img id="niagara_falls" src="images/niagara-falls.jpeg" width="200" height="200"/>').bindTooltip('Niagara Falls');


var nAmericaWonders = [mammoth_cave, niagara_falls];

var cities = L.layerGroup([mammoth_cave, niagara_falls]);

nAmericaWondersMarkers = markers.addLayer(cities);

var border = L.featureGroup([nAmericaWondersMarkers]).addTo(map);
$(border).click(function(){ 
    map.fitBounds(border.getBounds());
});

var caminoPoints = [
    [42.4590, -5.8830],
    [43.16222, 1.23722],
  ];            
  
  var polyline = L.polyline(caminoPoints).addTo(map);  