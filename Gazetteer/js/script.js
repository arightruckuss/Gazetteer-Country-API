//initialize map and layer
tiles = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 3,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}),
	latlng = L.latLng(52, 6);

var map = L.map('map', {zoomControl: false, center: latlng, zoom: 2, layers: [tiles]});

var mapBaselayers = {
    "Satellite Map": L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Black Map": L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'), 
    "Colors Map": L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
};

var rainMap = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');
var cloudMap = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');
var landTemp = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');

//AJAX calls to PHP files
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
    var latLon = L.latLng(latit, longit);
    var bounds = latLon.toBounds(5000000); // 500 = metres
    map.panTo(latLon).fitBounds(bounds);
    var home = L.marker([latit, longit], {icon: homeIcon}).bindTooltip("Home Sweet Home!").addTo(map);       
    
    var overlayMaps = {
        "Rain": rainMap,
        "clouds": cloudMap,
        "Land Temp": landTemp,
        "Home": home,
    }
    
    L.control.layers(mapBaselayers, overlayMaps, {position: 'bottomright'}).addTo(map);
    
//Wonders of the world
$('#worldIcon').click(function(){
    map.setView([latit, longit], 2);
    
});

$.ajax({
    url: "php/getUsersCountryCode.php",
    type: 'POST',
    dataType: 'json',
    data: {
        latitude: latit,
        longitude: longit, 
    },
    success: function(result) {
        if (result.status.name == "ok") {
            $usersCountryCode = result['data']['results'][0]['components']['ISO_3166-1_alpha-3'];
            $usersCountry = result['data']['results'][0]['components']['country'];
            //Dropdown country list
          
        
$.getJSON('php/getCountryList.php', function(data) {
$('#countryList').html('');
$('#countryList').append($('<option value='+ $usersCountryCode +'>' + $usersCountry + '</option>'));
for(var i = 0; i < data['data'].length; i++) {
    names = data['data'][i]['name'];
    code = data['data'][i]['code'];
    $('#countryList').append($('<option value='+ code +'>' + names + '</option>'));      
    }
}); 

$("#countryList").change(function() {
    $('#countryList').append($('<option value='+ $usersCountryCode +'>' + $usersCountry + '</option>'));  
        $("#countryList").ready(function(){ 
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
                            console.log($countryCode);
                        
    $.ajax({
        url: "php/getLocationLatLng.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $countryCode,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                if(result['data'][1] == undefined || result['data'][1] == null)  {
                    alert("Unable to locate");
                } else {
                $countryLat = result['data'][1][0]['latitude'];
                $countryLng = result['data'][1][0]['longitude'];
                }
                
                var locationMarker = L.icon({
                    iconUrl: 'images/location_marker.png',
                    iconSize:     [60, 60],
                    iconAnchor:   [30, 60],
                    popupAnchor: [-3,-45],
                });

                var new_marker = L.marker([$countryLat, $countryLng], {icon: locationMarker}).addTo(map);
                map.panTo(new L.LatLng($countryLat, $countryLng));
                
                $('#countryList').click( function (e) {
                    if (new_marker) {
                    map.removeLayer(new_marker);
                    }
                    new_marker = L.marker([$countryLat, $countryLng], {icon: locationMarker}).addTo(map);
                    $('#countryList').click(function(){
                        map.removeLayer(new_marker);
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
                
                map.fitBounds(borders.getBounds());

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
                $callingCode = result['data']['callingCodes'][0];
                $currencyName = result['data']['currencies'][0]['name'];
                $currencyCode = result['data']['currencies'][0]['code'];
                $currencySymbol = result['data']['currencies'][0]['symbol'];

                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }

                $population = formatNumber($population);
                
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
                $windKPH = result['data']['wind_kph'];
    
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
        url: "php/getLocalTime.php",
        type: 'POST',
        dataType: 'json',
        data: { 
            lat: $countryLat,
            long: $countryLng,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $localTime = result['data']['date_time_txt'];

        $.ajax({
            url: "php/getCovidByCountry.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryName,
            },
            success: function(result) {
    
                if (result.status.name == "ok") {
                    if(result['data'][0] == undefined || result['data'][0] == null){
                            $covidTodayCases = "N/A";
                            $covidTodayDeaths = "N/A";
                            $covidTotalCases = "N/A";
                            $covidTotalDeaths = "N/A";
                    } else {
                        $covidTodayCases = result['data']['todayCases'];
                        $covidTodayDeaths = result['data']['todayDeaths'];
                        $covidTotalCases = result['data']['cases'];
                        $covidTotalDeaths = result['data']['deaths'];

                        function formatNumber(num) {
                            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                        }
                        
                        $covidTodayCases = formatNumber($covidTodayCases)
                        $covidTodayDeaths = formatNumber($covidTodayDeaths)  
                        $covidTotalCases = formatNumber($covidTotalCases)
                        $covidTotalDeaths = formatNumber($covidTotalDeaths)
                    }

        $.ajax({
            url: "php/getCovidWorldTotal.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryName,
            },
            success: function(result) {
    
                if (result.status.name == "ok") {
                    if(result == undefined){
                        $covidWorldDead = "N/A";
                        $covidWorldConfirmed = "N/A";
                        $covidWorldDead = "N/A";
                        $covidWorldConfirmed = "N/A";
                    } else {
                        $covidWorldDead = result['data']['TotalDeaths'];
                        $covidWorldConfirmed = result['data']['TotalConfirmed'];

                        function formatNumber(num) {
                            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                        }

                        $covidWorldDead = formatNumber($covidWorldDead)
                        $covidWorldConfirmed = formatNumber($covidWorldConfirmed)
                    }

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
                    if(result['data']['data'][0] != undefined){
                        $headline1 = result['data']['data'][0]['title'];
                        $description1 = result['data']['data'][0]['description'];
                        $url1 = result['data']['data'][0]['url'];

                        $headline2 = result['data']['data'][1]['title'];
                        $description2 = result['data']['data'][1]['description'];
                        $url2 = result['data']['data'][1]['url'];

                        $headline3 = result['data']['data'][2]['title'];
                        $description3 = result['data']['data'][2]['description'];
                        $url3 = result['data']['data'][2]['url'];
                    } else {
                        $headline1 = "N/A";
                        $headline2 = "N/A";
                        $headline3 = "N/A";
                        $source1 = " ";
                        $source2 = " ";
                        $source3 = " ";
                        $url1 = " ";
                        $url2 = " ";
                        $url3 = " ";
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
                    if(result['data'][0] == null || result['data'][0] == undefined) {
                        $photo1 = 'images/na.png';
                        $photo2 = 'images/na.png';
                        $photo3 = 'images/na.png';
                        $photo4 = 'images/na.png';
                        $photo5 = 'images/na.png';
                    } else {
                        $photo1 = result['data'][0]['webformatURL'];
                        $photo2 = result['data'][1]['webformatURL'];
                        $photo3 = result['data'][2]['webformatURL'];
                        $photo4 = result['data'][3]['webformatURL'];
                        $photo5 = result['data'][4]['webformatURL'];
                    }

                    $('#pic1').html('<img class="d-block w-100" src="' + $photo1 + '" alt="First slide"><div class="numbertext">1 / 5</div>');
                    $('#pic2').html('<img class="d-block w-100" src="' + $photo2 + '" alt="Secound slide"><div class="numbertext">2 / 5</div>');
                    $('#pic3').html('<img class="d-block w-100" src="' + $photo3 + '" alt="Third slide"><div class="numbertext">3 / 5</div>');
                    $('#pic4').html('<img class="d-block w-100" src="' + $photo4 + '" alt="Fourth slide"><div class="numbertext">4 / 5</div>');
                    $('#pic5').html('<img class="d-block w-100" src="' + $photo5 + '" alt="Fifth slide"><div class="numbertext">5 / 5</div>');


                    var countryInfo = '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/><p>Capital: '
                    + $capital + '</p><p>Population: ' + $population + '</p><p>' + $language + '</p><p>' + $continent + '</p><p>'
                    + $currencyCode + ' ' + $currencyName + ' ' + $currencySymbol +'</p><p>UK Dailing Code: +' + $callingCode + '</p>';

                    var weatherInfo = '<p id="weatherText">' + $tempC + '<small>&#x2103</small><br><br>' + $condition + '</p>';
                    
                    $('#weatherInfo').html(weatherInfo);
                    $('#weatherWind').html($windKPH + '<br><small>km/h');

                    //Newspaper content
                    $('#newsHeadline1').html($headline1);
                    $('#newsContent1').html($description1);
                    $('#url1').html('<a href="' + $url1 + '">' + $url1 + '</a>');

                    $('#newsHeadline2').html($headline2);
                    $('#newsContent2').html($description2);
                    $('#url2').html('<a href="' + $url2 + '">' + $url2 + '</a>');

                    $('#newsHeadline3').html($headline3);
                    $('#newsContent3').html($description3);
                    $('#url3').html('<a href="' + $url3 + '">' + $url3 + '</a>');
                         
                    
                    //Covid content
                    $('#covidHeader').html('Coronavirus<br>' + $countryName);
                    $('#covidNewCases').html($covidTodayCases);
                    $('#covidNewDeaths').html($covidTodayDeaths);
                    $('#casesCountryTotal').html($covidTotalCases);
                    $('#deathsCountryTotal').html($covidTotalDeaths);
                    $('#casesWorldTotal').html($covidWorldConfirmed);
                    $('#deathsWorldTotal').html($covidWorldDead);

                    new_marker.bindPopup(countryInfo);
                    new_marker.openPopup();

                   var overlayMaps = {
                        "Marker": new_marker
                    }

                    $('#countryList').click(function(){
                        map.removeLayer(new_marker);
                    }); 
                 
                }},});
                }},});
                }},});
                }},});
                }},});
                }},});
                }},});
                }},});   

                                }}})
                            }}}},       
        });
});
}).change();
}} 
});   
})} 

//Page loading
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


