//initialize map
var map = L.map('map', {
	center:[1, 1], 
    zoom: 7,
})

//Map tiles
L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map);

//Locate current location
function getLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
    }

getLocation();

//Country boarders
L.geoJSON(borders, {
    style: function(feature) {
    return {
        fillOpacity: 0,
        stroke: true,
        color: "blue", // Lines in between countries.
        weight: 1
        };
    }
    }).bindPopup(function(layer) {
    return layer.feature.properties.name;
    }).addTo(map);

//Country list
function countryList(){
    $.get("php/gazetteerphp.php",
    function(data){
      $("#json_result").html(data);
    });
}
