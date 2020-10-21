//initialize map
var map = L.map('mapid', {
	center:[40, 1], 
	zoom: 1,
})

function satelliteMap(){
L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map);
}
satelliteMap();

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

function showMapChoice() {
     document.getElementById("mapChoice").style.visibility = "visible";
}

/*Country list*/
function countryList(){
    $.get("php/gazetteerphp.php",
    function(data){
      $("#json_result").html(data);
    });
}

/*Menu box display*/
function menuButton() {
    var x = document.getElementById("mapChoice");
    if (x.style.display == "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }