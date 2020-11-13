//initialize map
var map = L.map('map', {
    zoom: 5,
})

L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
    attribution: '&copy; contributors: <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map); 

var baselayers = {
    "Satellite Map": L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd'),
    "White Map": L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Black Map": L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'), 
    "Colors Map": L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Hill Shade": L.tileLayer('https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Hill Shade": L.tileLayer('https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Precipitation": L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Cloud Cover": L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593'),
    "Land Temp": L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593')
};

var overlays = {};

L.control.layers(baselayers, overlays, {position: 'bottomleft'}).addTo(map);

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
function showCountryInfo() {
    var x = document.getElementById("countryInfoBox");
    if (x.style.display == "none") {
        x.style.display = "block";
    } else {
        x.style.display = "block";
    }
    }

function hideButton() {
    var x = document.getElementById("countryInfoBox");
    if (x.style.display == "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
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
                        $('#txtCountry').html($countryName);

                        $countryBorders = result['data'][i]['geometry'];
                        console.log($countryBorders);
                        L.geoJSON($countryBorders, {
                            "color": "purple",
                            "weight": 5,
                            "opacity": 0.65
                        }).addTo(map);

    $.ajax({
        url: "php/getCountryInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $countryName,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                for(var i = 0; i <result['data'].length; i++){
                    $iso3 = result['data'][i]['isoAlpha3'];
                    if($iso3 == $listCountryCode){
                        $('#txtCapital').html(result['data'][i]['capital']);
                        $('#txtPopulation').html(result['data'][i]['population']);
                        
                    }
                }
        }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});

    $.ajax({
        url: "php/getWeatherInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $countryCode,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $('#txtTemp').html(result['data']['temp_c']);
                $('#txtHumidity').html(result['data']['humidity']);
                $('#txtCondition').html(result['data']['condition']['text']);

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
                $('#txtSunRise').html(result['data']['astro']['sunrise']);
                $('#txtSunSet').html(result['data']['astro']['sunset']);
                $('#txtMoonRise').html(result['data']['astro']['moonrise']);
                $('#txtMoonSet').html(result['data']['astro']['moonset']);
                $('#txtMoonPhase').html(result['data']['astro']['moon_phase']);

        }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});

}}}},  
error: function(jqXHR, textStatus, errorThrown) {
}     
}); 
});

