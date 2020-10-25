//initialize map
var map = L.map('map', {
	center:[45, 20], 
    zoom: 2,
})


L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map);

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

//initialize map
var map = L.map('map', {
	center:[45, -122], 
    zoom: 3,
})

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

//Meter maps
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

function zeroMeter(){
    document.getElementById('hillMeter').value = 0;
    document.getElementById('precipitationMeter').value = 0;
    document.getElementById('cloudMeter').value = 0;
    document.getElementById('tempMeter').value = 0; 
}

//Weather maps
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

//Country list
function countryList(){
    $.get("php/gazetteerphp.php",
    function(data){
      $("#json_result").html(data);
    });
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


    