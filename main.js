//initialize map
var map = L.map('mapid', {
	center:[0, 0], 
	zoom: 1,
})

//create map layers
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 1,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
    }).addTo(map);
	
	//locate users position
	var myLocation = map.locate({setView: true, maxZoom: 14});

var length = L.polygon([[47, 92],[41, 91],[35, 93]], {
		fillColor: 'red', 
		opacity: 1, 
		color: 'red'
	}).bindPopup("You are here!").addTo(map);
	
//create marker for current location
function displayCountryInfo(countryByAlpha3Code){
	const locationData = countries.find(country => country.alpha3Code === countryByAlpha3Code);
	myLocationMarker = L.marker([locationData.latlng[0], countryData.latlng[1]], {icon: current_location_man}).addTo(map);
	myLocationMarker.bindPopup("<h1>You are here!</h1>");
}

function postcode_search(){
    var postcode=$("#ip_address").val();
    $.get("weather_api.php",{postcode:postcode},
    function(data){
      $("#json_result").html(data);
    });
}


//Global Variabies
const countriesList = document.getElementById('countries');
let countries; 

//Event listener for changes to country 

countriesList.addEventListener("change", event => displayCountryInfo(event.target.value));

//collects data from REST API 
fetch('https://restcountries.eu/rest/v2/all')
.then(res => res.json())
.then(data => initialize(data))
.catch(err => console.log("Error: ", err));


function initialize(countriesData){
    countries = countriesData;
    let options = "";
    countries.forEach(country => options += `<option value="${country.alpha3Code}">${country.name}</option>`);
    countriesList.innerHTML = options;
	displayCountryInfo("NGA");
}


function displayCountryInfo(countryByAlpha3Code){
    const countryData = countries.find(country => country.alpha3Code === countryByAlpha3Code);
    console.log(countryData);
    document.querySelector("#flag-container img").src = countryData.flag;
    document.querySelector("#flag-container img").alt = `flag of ${countryData.name}`;
    document.getElementById("capital").innerHTML = countryData.capital;
    document.getElementById("dialing-code").innerHTML = `+${countryData.callingCodes[0]}`;
    document.getElementById("population").innerHTML = countryData.population;
    document.getElementById("currencies").innerHTML = countryData.currencies.filter(c => c.name).map(c => `${c.symbol} ${c.name} (${c.code})`).join(", ");
    document.getElementById("region").innerHTML = countryData.region;
    document.getElementById("subregion").innerHTML = countryData.subregion;
    document.getElementById("timezone").innerHTML = countryData.timezones;
    document.getElementById("lat").innerHTML = countryData.latlng[0];
    document.getElementById("lng").innerHTML = countryData.latlng[1];

    var current_location_man = L.icon({
        iconUrl: 'current_location_man.png',
        iconSize:     [30, 65], // size of the icon
        iconAnchor:   [15, 60], // point of the icon which will correspond to marker's location
    });

    var new_location = L.icon({
        iconUrl: 'new_location.png',
    
        iconSize:     [30, 65], // size of the icon
        iconAnchor:   [15, 60], // point of the icon which will correspond to marker's location
    });
    

	map.setView(new L.LatLng(countryData.latlng[0], countryData.latlng[1]), 4);
	L.marker([countryData.latlng[0], countryData.latlng[1]], {icon: new_location}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng, {icon: current_location_man}).addTo(map)
	L.circleMarker(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);

}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

var day = new Date().getDay();
	var month = new Date().getMonth();
	var date = new Date().getUTCDate();
	var year = new Date().getUTCFullYear();

	switch (day) {
		case 1:
		day = "Monday";
		break;
		case 2:
		day = "Tuesday";
		break;
		case 3:
		day = "Wenesday";
		break;
		case 4:
		day = "Thursday";
		break;
		case 5:
		day = "Friday";
		break;
		case 6:
		day = "Saturday";
		break;
		case 0:
		day = "Sunday";
	}

switch (month) {
	case 0:
	month = "January";
	case 1:
	month = "February";
	break;
	case 2:
	month = "March";
	break;
	case 3:
	month = "April";
	break;
	case 4:
	month = "May";
	break;
	case 5:
	month = "June";
	break;
	case 6:
	month = "July";
	break;
	case 7:
	month = "August";
	case 8:
	month = "June";
	break;
	case 9:
	month = "June";
	break;
	case 10:
	month = "June";
	break;
	case 11:
	month = "June";
	break;
}

const areaSelect = document.querySelector(`[id="select_wonders"]`);

areaSelect.addEventListener(`change`, (e) => {
  // log(`e.target`, e.target);
  const select = e.target;
  const value = select.value;
  const desc = select.selectedOptions[0].text;

  if(desc == "Niagara Falls"){
	map.panTo([43.1062, -79.0577], 14);
	document.getElementById("wonder_country").innerHTML = "England";
	document.getElementById("wonder_capital").innerHTML = "London";
	var new_location = L.icon({
        iconUrl: 'Niagara-Falls.jpeg',
    
        iconSize:     [180, 180], // size of the icon
});

	L.marker([43.1000, -79.0577], {icon: new_location}).addTo(map);	
  } 
  if(desc == "Pyramids"){
	map.panTo([29.7959155, 30.869106], 11);
  }   
  if(desc == "Stonehenge"){
	map.panTo([51.1795277, -1.8294766], 11);
  }
});


