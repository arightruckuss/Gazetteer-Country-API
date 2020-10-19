//initialize map
var map = L.map('mapid', {
	center:[40, 1], 
	zoom: 1,
})

//create map layers
L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd', {
    maxZoom: 18,
    minZoom: 2,
    tileSize: 512,
    zoomOffset: -1,
    }).addTo(map);
