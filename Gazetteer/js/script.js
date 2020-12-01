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
    "Rain Clouds": L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Cloud Cover": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Land Temp": L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593')
};

L.control.layers(mapBaselayers, null, {position: 'topright'}).addTo(map);

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
            $('#countryList').append($('<option value='+ $usersCountryCode +'>' + $usersCountry + '</option>'));  
        
$.getJSON('php/getCountryList.php', function(data) {
$('#countryList').html('');
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
                console.log($countryLat);
                console.log($countryLng);
                
                var locationMarker = L.icon({
                    iconUrl: 'images/location_marker.png',
                    iconSize:     [60, 60],
                    iconAnchor:   [30, 60],
                    popupAnchor: [-3,-45],
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
                    $covidTodayCases = result['data']['todayCases'];
                    $covidTodayDeaths = result['data']['todayDeaths'];
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

                    $covidWorldDead = result['data']['TotalDeaths'];
                    $covidWorldConfirmed = result['data']['TotalConfirmed'];

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
                            $source1 = result['data']['hits'][0]['source'];
                            $url1 = result['data']['hits'][0]['url'];

                            $headline2 = result['data']['hits'][1]['title'];
                            $source2 = result['data']['hits'][1]['source'];
                            $url2 = result['data']['hits'][1]['url'];

                            $headline3 = result['data']['hits'][2]['title'];
                            $source3 = result['data']['hits'][2]['source'];
                            $url3 = result['data']['hits'][2]['url'];

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
                    $photo1 = result['data'][0]['webformatURL'];
                    $photo2 = result['data'][1]['webformatURL'];
                    $photo3 = result['data'][2]['webformatURL'];
                    $photo4 = result['data'][3]['webformatURL'];
                    $photo5 = result['data'][4]['webformatURL'];
                    $photo6 = result['data'][5]['webformatURL'];
                    $photo7 = result['data'][6]['webformatURL'];
                    $photo8 = result['data'][7]['webformatURL'];
                    $photo9 = result['data'][8]['webformatURL'];
                    $photo10 = result['data'][9]['webformatURL'];
                    $photo11 = result['data'][10]['webformatURL'];

                    $('#pic1').html('<img class="d-block w-100" src="' + $photo1 + '" alt="First slide"><div class="numbertext">1 / 10</div>');
                    $('#pic2').html('<img class="d-block w-100" src="' + $photo2 + '" alt="Secound slide"><div class="numbertext">2 / 10</div>');
                    $('#pic3').html('<img class="d-block w-100" src="' + $photo3 + '" alt="Third slide"><div class="numbertext">3 / 10</div>');
                    $('#pic4').html('<img class="d-block w-100" src="' + $photo4 + '" alt="Fourth slide"><div class="numbertext">4 / 10</div>');
                    $('#pic5').html('<img class="d-block w-100" src="' + $photo5 + '" alt="Fifth slide"><div class="numbertext">5 / 10</div>');
                    $('#pic6').html('<img class="d-block w-100" src="' + $photo6 + '" alt="Sixth slide"><div class="numbertext">6 / 10</div>');
                    $('#pic7').html('<img class="d-block w-100" src="' + $photo7 + '" alt="Sixth slide"><div class="numbertext">7 / 10</div>');
                    $('#pic8').html('<img class="d-block w-100" src="' + $photo8 + '" alt="Sixth slide"><div class="numbertext">8 / 10</div>');
                    $('#pic9').html('<img class="d-block w-100" src="' + $photo9 + '" alt="Sixth slide"><div class="numbertext">9 / 10</div>');
                    $('#pic10').html('<img class="d-block w-100" src="' + $photo10 + '" alt="Sixth slide"><div class="numbertext">10 / 10</div>');


                    var countryInfo = '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png"/><h5>' + $countryName + '</h5><p>Capital: '
                    + $capital + '</p><p>Population: ' + $population + '</p><p>' + $language + '</p><p>' + $continent + '</p><p>'
                    + $currencyCode + ' ' + $currencyName + ' ' + $currencySymbol +'</p>';

                    var weatherInfo = '<img id="weatherIcon" src="images/weather_icon.png" /><p id="weatherText">' + $tempC + '&#8451  ' + $condition + '</p>';
                    
                    $('#weatherInfo').html(weatherInfo);

                    //Newspaper content
                    $('#newsHeader').html('<p>Daily ' + $countryName + '</p>');
                    $('#localTime').html('<p>' + $localTime + '</p>');
                    $('#source1').html('<p>' + $source1 + '</p>');
                    $('.contentOne').html('<p>' + $headline1 + '</p>');
                    $('#url1').html('<a href="' + $url1 + '" class="urlText"><i>' + $url1 + '</i></a>');

                    $('#source2').html('<p>' + $source2 + '</p>');
                    $('.contentTwo').html('<p>' + $headline2 + '</p>');
                    $('#url2').html('<a href="' + $url2 + '" class="urlText"><i>' + $url2 + '</i></a>');

                    $('#source3').html('<p>' + $source3 + '</p>');
                    $('.contentThree').html('<p>' + $headline3 + '</p>');
                    $('#url3').html('<a href="' + $url3 + '" class="urlText"><i>' + $url3+ '</i></a>');

                    //Covid content
                    $('#covidHeader').html('<p>Coronavirus ' + $countryName + '</p>');
                    $('#covidNewCases').html('<p>' + $covidTodayCases + '</p>');
                    $('#covidNewDeaths').html('<p>' + $covidTodayDeaths  + '</p>');
                    $('#casesCountryTotal').html('<p>' + $covidTotalCases + '</p>');
                    $('#deathsCountryTotal').html('<p>' + $covidTotalDeaths  + '</p>');
                    $('#casesWorldTotal').html('<p>' + $covidWorldConfirmed + '</p>');
                    $('#deathsWorldTotal').html('<p>' + $covidWorldDead  + '</p>');
                   

                    $(document).ready(function(){
                        var new_marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindPopup(countryInfo).addTo(map);
                        new_marker.openPopup();
                        new_marker.openPopup();
                        $('#countryList').click(function(){
                            map.removeLayer(new_marker);
                        }); 
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

//Photos fade background 
$("#photoIcon").click(function(){
    $("#carouselExampleControls").css("display", "block");
    $("#photoIcon").css("display", "none");
    $("#photoIcon2").css("display", "block");
    $("#newsPaper").css("display", "none");
    $("#newsScreen").css("display", "none");
    $("#covidPaper").css("display", "none");
    $("#covidScreen").css("display", "none");
  });

  $(function(){
  var photoPop = function(){
      $('#photoScreen').css({    "display": "block", opacity: 0.7, "width":$(document).width(),"height":$(document).height()});
      $('#photoIcon2').css({"display": "block"}).click(function(){$(this).css("display", "none");$('#photoScreen').css("display", "none")});
  }
  $('#photoIcon').click(photoPop);
  });
  
  
$("#photoIcon2").click(function(){
    $("#carouselExampleControls").css("display", "none");
    $("#photoIcon").css("display", "block");
    $("#photoIcon2").css("display", "none");
    $("#newsPaper").css("display", "none");
    $("#newsScreen").css("display", "none");
    $("#covidPaper").css("display", "none");
    $("#covidScreen").css("display", "none");
});

//Newsfade background
$("#newsIcon").click(function(){
    $("#newsPaper").css("display", "block");
    $("#newsIcon").css("display", "none");
    $("#newsIcon2").css("display", "block");
    $("#carouselExampleControls").css("display", "none");
    $("#photoScreen").css("display", "none");
    $("#covidPaper").css("display", "none");
    $("#covidScreen").css("display", "none");
});

$(function(){
    var newsPop = function(){
        $('#newsScreen').css({    "display": "block", opacity: 0.7, "width":$(document).width(),"height":$(document).height()});
        $('#newsIcon2').css({"display": "block"}).click(function(){$(this).css("display", "none");$('#newsScreen').css("display", "none")});
    }
    $('#newsIcon').click(newsPop);
    });

$("#newsIcon2").click(function(){
    $("#newsPaper").css("display", "none");
    $("#newsIcon").css("display", "block");
    $("#newsIcon2").css("display", "none");
    $("#carouselExampleControls").css("display", "none");
    $("#photoScreen").css("display", "none");
    $("#covidPaper").css("display", "none");
    $("#covidScreen").css("display", "none");
});

//Covid background
$("#covidIcon").click(function(){
    $("#covidPaper").css("display", "block");
    $("#covidIcon").css("display", "none");
    $("#covidIcon2").css("display", "block");
    $("#newsPaper").css("display", "none");
    $("#newsScreen").css("display", "none");
    $("#carouselExampleControls").css("display", "none");
    $("#photoScreen").css("display", "none");
});

$(function(){
    var covidPop = function(){
        $('#covidScreen').css({    "display": "block", opacity: 0.7, "width":$(document).width(),"height":$(document).height()});
        $('#covidIcon2').css({"display": "block"}).click(function(){$(this).css("display", "none");$('#covidScreen').css("display", "none")});
    }
    $('#covidIcon').click(covidPop);
    });

$("#covidIcon2").click(function(){
    $("#covidPaper").css("display", "none");
    $("#covidIcon").css("display", "block");
    $("#covidIcon2").css("display", "none");
    $("#newsPaper").css("display", "none");
    $("#newsScreen").css("display", "none");
    $("#carouselExampleControls").css("display", "none");
    $("#photoScreen").css("display", "none");
});
