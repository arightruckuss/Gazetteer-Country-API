//initialize map
var map = L.map('map', {
    zoom: 4,
})

L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
    attribution: '&copy; contributors: <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map); 

var mapBaselayers = {
    "Satellite Map": L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd'),
    "White Map": L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Black Map": L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'), 
    "Colors Map": L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
};

var shadeBaselayers = {
    "Hill Shade": L.tileLayer('https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Precipitation": L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Cloud Cover": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Land Temp": L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593')
}

var overlays = {};

L.control.layers(mapBaselayers, overlays, {position: 'bottomleft'}).addTo(map);
L.control.layers(shadeBaselayers, overlays, {position: 'bottomleft'}).addTo(map);

//Current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latit = position.coords.latitude;
      longit = position.coords.longitude;
      var greenIcon = L.icon({
        iconUrl: 'images/home_location.png',
        iconSize:     [60, 60],
        iconAnchor:   [30, 60],
    })

    L.marker([latit, longit], {icon: greenIcon}).bindTooltip("Home Sweet Home!").addTo(map);
    map.panTo(new L.LatLng(latit, longit));
    var offset = map.getSize().x*-0.20;
    map.panBy(new L.Point(-offset, 0), {animate: false});
   
  })};

//Display country info
function categoryMenu() {
    var categories = document.getElementById("categoryMenu");
    if (categories.style.display == "block") {
        info.style.display = "none";
        categories.style.display = "none";
        weather.style.display = "none";
        news.style.display = "none";
        astronomy.style.display = "none";
        covid.style.display = "none";
    } else {
        categories.style.display = "block";
    }
    }

var info = document.getElementById("countryInfo");
var weather = document.getElementById("countryWeather");  
var news = document.getElementById("countryNews");
var currency = document.getElementById("countryCurrency");
var astronomy = document.getElementById("countryAstronomy"); 
var covid = document.getElementById("countryCovid");

function countryInfo() {
    weather.style.display = "none";
    news.style.display = "none";
    currency.style.display = "none";
    astronomy.style.display = "none"; 
    covid.style.display = "none";     
    if (info.style.display == "block") {
        info.style.display = "none";
    } else {
        info.style.display = "block";
    }
    }

function countryWeather() {
    info.style.display = "none";
    news.style.display = "none";
    currency.style.display = "none";
    astronomy.style.display = "none"; 
    covid.style.display = "none";   
    if (weather.style.display == "block") {
        weather.style.display = "none";
    } else {
        weather.style.display = "block";
    }
    }

function countryNews() {
    info.style.display = "none";
    weather.style.display = "none";
    currency.style.display = "none";
    astronomy.style.display = "none"; 
    covid.style.display = "none";  
    if (news.style.display == "block") {
        news.style.display = "none";
    } else {
        news.style.display = "block";
    }
    }

function countryCurrency() {
    info.style.display = "none";
    weather.style.display = "none";
    news.style.display = "none";
    astronomy.style.display = "none"; 
    covid.style.display = "none";    
    if (currency.style.display == "block") {
        currency.style.display = "none";
    } else {
        currency.style.display = "block";
    }
    }

function countryAstronomy() {
    info.style.display = "none";
    weather.style.display = "none";
    currency.style.display = "none"
    news.style.display = "none";
    covid.style.display = "none";    
    if (astronomy.style.display == "block") {
        astronomy.style.display = "none";
    } else {
        astronomy.style.display = "block";
    }
    }

function countryCovid() {
    info.style.display = "none";
    weather.style.display = "none";
    currency.style.display = "none"
    news.style.display = "none";
    astronomy.style.display = "none";    
    if (covid.style.display == "block") {
        covid.style.display = "none";
    } else {
        covid.style.display = "block";
    }
    }

//Dropdown country list
$.getJSON('php/getCountryList.php', function(data) {
    $('#countryList').html('');
    for(var i = 0; i < data['data'].length; i++) {
        names = data['data'][i]['name'];
        value = data['data'][i]['code'];
        $('#countryList').append($('<option value='+ value +'>' + names + '</option>'));
        }

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
                $('#txtCapital').html(result['data']['capital']);
                $('#txtPopulation').html(result['data']['population']);
                $('#txtlanguage').html(result['data']['languages'][0]['name']);
                $('#txtContinent').html(result['data']['region']);
                $('#txtSubRegion').html(result['data']['subregion']);
                $('#txtAlpha2Code').html(result['data']['alpha2Code']);
                $('#txtAlpha3Code').html(result['data']['alpha3Code']);
                $('#txtTimeZones').html(result['data']['timezones']);
                $('#txtDialCode').html(result['data']['callingCodes']);
                $('#txtCurrency').html('Currency '  + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
                $('#txtCurNme').html(result['data']['currencies'][0]['name']);
                $('#txtCurCode').html(result['data']['currencies'][0]['code']);
                $('#txtCurSymbol').html(result['data']['currencies'][0]['symbol']);
    
                
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
                $('#txtTempC').html(result['data']['temp_c']);
                $('#txtTempF').html(result['data']['temp_f']);
                $('#txtHumidity').html(result['data']['humidity']);
                $('#txtCondition').html(result['data']['condition']['text']);
                $('#txtWindMPH').html(result['data']['wind_mph']);
                $('#txtWindKPH').html(result['data']['wind_kph']);
                $('#txtFeelC').html(result['data']['feelslike_c']);
                $('#txtFeelF').html(result['data']['feelslike_f']);

        }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});
    
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
                })

                map.panTo(new L.LatLng($countryLat, $countryLng), {draggable:false});

                var marker =  L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindTooltip($countryName).addTo(map);

                map.on('move', function (e) {
                    if (marker) {
                      map.removeLayer(marker);
                    }
                    marker = L.marker([$countryLat, $countryLng], {icon: locationMarker}).bindTooltip($countryName).addTo(map);
                    
                    }
                );

         }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});

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
                $('#txtLocalTime').html(result['data']['astro']['sunrise']);
                $('#txtSunRise').html(result['data']['astro']['sunrise']);
                $('#txtSunSet').html(result['data']['astro']['sunset']);
                $('#txtMoonRise').html(result['data']['astro']['moonrise']);
                $('#txtMoonSet').html(result['data']['astro']['moonset']);
                $('#txtMoonPhase').html(result['data']['astro']['moon_phase']);

        }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});

        $.ajax({
            url: "php/getCovidByCountry.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryName,
            },
            success: function(result) {
    
                if (result.status.name == "ok") {
                    $('#txtCovid').html('Covid ' + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
                    $('#txtConfirmed').html(result['data'][0]['Confirmed']);
                    $('#txtDead').html(result['data'][0]['Deaths']);
                    $('#txtRecovered').html(result['data'][0]['Recovered']);
                    $('#txtActive').html(result['data'][0]['Active']);
            }},
            error: function(jqXHR, textStatus, errorThrown) {
            }});

        $.ajax({
            url: "php/getCovidWorldTotal.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryName,
            },
            success: function(result) {
    
                if (result.status.name == "ok") {
                    $('#txtTConfirmed').html(result['data']['TotalConfirmed']);
                    $('#txtTDead').html(result['data']['TotalDeaths']);
                    $('#txtTRecovered').html(result['data']['TotalRecovered']);
            }},
            error: function(jqXHR, textStatus, errorThrown) {
            }});

        $.ajax({
            url: "php/getCountryNews.php",
            type: 'POST',
            dataType: 'json',
            data: {
                country: $countryISO2,
            },
            success: function(result) {
    
                if (result.status.name == "ok") {
                    $('#txtNews').html('Weather ' + '<img id="flag" src="https://www.countryflags.io/' + $countryISO2 + '/flat/64.png" width="33" height="33"/>');
                    $('#txtHeadline1').html(result['data']['hits'][0]['title']);
                    $('#txtHeadline2').html(result['data']['hits'][1]['title']);
                    $('#txtHeadline3').html(result['data']['hits'][2]['title']);
                 }},
            error: function(jqXHR, textStatus, errorThrown) {
            }});
        
        }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});
        
}}}},  
error: function(jqXHR, textStatus, errorThrown) {
}     
}); 
});

