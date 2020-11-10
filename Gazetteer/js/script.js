//initialize map
var map = L.map('map', {
    zoom: 5,
})

L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map);     

//Current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      latit = position.coords.latitude;
      longit = position.coords.longitude;
      var greenIcon = L.icon({
        iconUrl: 'images/green_location.png',
        iconSize:     [45, 55],
        iconAnchor:   [22, 55],
    })

    L.marker([latit, longit], {icon: greenIcon}).addTo(map);
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

//Menu box display
function menuButton() {
    var x = document.getElementById("mapChoice");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

//Display map functions
function satelliteMap(){
    L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
    }

function streetMap(){
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
}

function lightMap(){
    L.tileLayer('https://api.maptiler.com/maps/bright/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
}

function blackWhiteMap(){
    L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
}

//Map shading and values
function hillShadeMap(){
    L.tileLayer('https://api.maptiler.com/tiles/hillshades/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);

        var value = parseInt(document.getElementById('hillMeter').value, 12);
        value = isNaN(value) ? value : value;
        value++;
        document.getElementById('hillMeter').value = value;
}
    
    
function precipitationMap(){
    L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
    
        var value = parseInt(document.getElementById('precipitationMeter').value, 8);
        value = isNaN(value) ? value : value;
        value++;
        document.getElementById('precipitationMeter').value = value;
}

function cloudMap(){
    L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);
        
        var value = parseInt(document.getElementById('cloudMeter').value, 12);
        value = isNaN(value) ? value : value;
        value++;
        document.getElementById('cloudMeter').value = value; 
    }

function tempMap(){
    L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593', {
        maxZoom: 18,
        minZoom: 2,
        tileSize: 512,
        zoomOffset: -1,
        }).addTo(map);

        var value = parseInt(document.getElementById('tempMeter').value, 8);
        value = isNaN(value) ? value : value;
        value++;
        document.getElementById('tempMeter').value = value; 
    }

function showMapChoice() {
        document.getElementById("mapChoice").style.visibility = "visible";
}

function zeroMeter(){
    document.getElementById('hillMeter').value = 1;
    document.getElementById('precipitationMeter').value = 1;
    document.getElementById('cloudMeter').value = 1;
    document.getElementById('tempMeter').value = 1; 
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
                        $countryGeometry = result['data'][i]['geometry'];
                        $('#txtCountry').html($countryName);

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
            country: $countryName,
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
            country: $countryName,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                $countryLat = result['data']['lat'];
                $countryLng = result['data']['lon'];

                var locationMarker = L.icon({
                    iconUrl: 'images/location_marker.png',
                    iconSize:     [45, 55],
                    iconAnchor:   [32, 65],
                })
                
                L.marker([$countryLat, $countryLng], {icon: locationMarker}).addTo(map);
                map.panTo(new L.LatLng($countryLat, $countryLng));
                var offset = map.getSize().x*-0.20;
                map.panBy(new L.Point(-offset, 0), {animate: false});
         }},
        error: function(jqXHR, textStatus, errorThrown) {
        }});

    $.ajax({
        url: "php/getAstronomyInfo.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $countryName,
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

        //ERROR Invalid geoJSON object
        $borders = L.geoJSON($countryGeometry).addTo(map);
        var myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        };
        
        L.geoJSON($borders, {
            style: myStyle
        }).addTo(map);

}}}},  
error: function(jqXHR, textStatus, errorThrown) {
}     
}); 
});

