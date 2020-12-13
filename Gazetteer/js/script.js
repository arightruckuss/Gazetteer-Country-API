//Page loading
$('body').append('<div style="" id="loadingDiv"><img id="loading-image" src="images/ajax-loader.gif" alt="Loading..." /></div></div>');
$(window).on('load', function(){
    setTimeout(removeLoader, 5000); //wait for page load PLUS two seconds.
});
function removeLoader(){
    $( "#loadingDiv" ).fadeOut(500, function() {
        // fadeOut complete. Remove the loading div
        $( "#loadingDiv" ).remove(); //makes page more lightweight 
    });  
}

//initialize map
var map = L.map('map', {zoomControl: false}).setView([40, 0], 3,);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd', {
        maxZoom: 18,
        minZoom: 3,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

//Map layers and control
var mapBaselayers = {
    "Satellite Map": L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=wJnNNBBw35SQm7Zc7Ptd'),
    "Black Map": L.tileLayer('https://api.maptiler.com/maps/toner/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'), 
    "Colors Map": L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=wJnNNBBw35SQm7Zc7Ptd'),
};

var rainMap = L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');
var cloudMap = L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');
var landTemp = L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=513dd1747f3b4fd4eeb27d17169c8593');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    userLat = position.coords.latitude;
    userLng = position.coords.longitude;

    var homeIcon = L.icon({
        iconUrl: 'images/home_location.png',
        iconSize:     [60, 60],
        iconAnchor:   [30, 60],
    })

    var home = L.marker([userLat, userLng], {icon: homeIcon}).bindTooltip("Home Sweet Home!").addTo(map);       
    map.setView([userLat, userLng]);

    $.ajax({
        url: "php/getUsersCountryCode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            latitude: userLat,
            longitude: userLng, 
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
    });//Country List 

//Country dropdown list
$('#countryList').append($('<option value='+ $usersCountryCode +'>' + $usersCountry + '</option>')); 
$("#countryList").change(function() {
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
                            console.log($countryCode)
    
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
                    popupAnchor: [-20,-45],
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
                "color": "#150485",
                "weight": 5,
                "opacity": 0.1
            }).addTo(map);

            map.on('move', function (e) {
                if (border) {
                map.removeLayer(border);
                }
                border = L.geoJSON($borders, {
                    "color": "#150485",
                    "weight": 5,
                    "opacity": 0.1
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
        url: "php/getCountryPopupPhoto.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: "FR",
        },
        success: function(result) {
            if (result.status.name == "ok") {   
                $countryPopupPic = result['data']['photos'][0]['image']['mobile'];
                

    var homePopup = L.popup({
        offset: [-20, -30]
    })
      .setLatLng([userLat, userLng])
      .setContent('<p id="countryPopupName">' + $usersCountry + '<br><img src="' + $countryPopupPic + '" id="countryPopupPic" /></p>');
    home.bindPopup(homePopup);

    var overlayMaps = {
        "Rain": rainMap,
        "clouds": cloudMap,
        "Land Temp": landTemp,
        "Home": home,
        "Marker": new_marker,
    }

var layerscontrol = L.control.layers(mapBaselayers, overlayMaps, {position: 'bottomright'}).addTo(map); 

$('#countryList').change(function(){
    layerscontrol.remove(map);
});

//Capital City button
$('#capitalCityButton').click(function(){
    map.setView([$countryLat, $countryLng], 7);
    new_marker.openPopup();
});  

//Global world button
$('#worldIcon').click(function(){
    map.setView([30, 0], 3);
});  

//Take me home button
$('#homeIcon').click(function(){
    map.setView([userLat, userLng], 7);
    home.openPopup();
});

$.ajax({
    url: "php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $countryCode,
    },
    success: function(result) {

        if (result.status.name == "ok") {
            if(result['data']['languages'] === undefined){
                $countryISO2 =  'N/A';
                $capital = 'N/A';
                $population = 'N/A';
                $language = 'N/A';
                $continent = 'N/A';
                $callingCode = 'N/A';
                $currencyName = 'N/A';
                $currencyCode = 'N/A';
                $currencySymbol = 'N/A';
            }else {
                $countryISO2 = result['data']['alpha2Code'];
                $capital = result['data']['capital'];
                $population = result['data']['population'];
                $language = result['data']['languages'][0]['name'];
                $continent = result['data']['region'];
                $callingCode = result['data']['callingCodes'][0];
                $currencyName = result['data']['currencies'][0]['name'];
                $currencyCode = result['data']['currencies'][0]['code'];
                $currencySymbol = result['data']['currencies'][0]['symbol'];
            }
    
            function formatNumber(num) {
                return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
            }

            $population = formatNumber($population);

$.ajax({
    url: "php/getCurrencyExchangeRate.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $currencyCode,
    },
    success: function(result) {
        if (result.status.name == "ok") {
            if(result['data']['conversion_rates'] === undefined){
                $otherRate = "N/A";
                $('#otherRate').html($otherRate);
            } else {
                $otherRate = result['data']['conversion_rates']['GBP'];
                $('#otherRate').html('<img id="otherRateIcon" src="http://rucktooa.co.uk/country_flags/w2560/' +$countryISO2+ '.png" alt="Other Flag" title="Other Flag"/> ' + $currencyCode);
                $('#exchangeRateInfo').html('1 GBP = ' + $otherRate);
            }
        }}});//Exchange Rate

            var countryInfo = '<img id="flag" src="http://rucktooa.co.uk/country_flags/w2560/' +$countryISO2+ '.png"/><p>Capital: '
            + $capital + '</p><p>Population: ' + $population + '</p><p>' + $language + '</p><p>' + $continent + '</p><p>UK Dailing Code: +' + $callingCode + '</p>';

            new_marker.bindPopup(countryInfo);
            new_marker.openPopup();

            $('#countryList').click(function(){
                map.removeLayer(new_marker);
            });

$.ajax({
    url: "php/getDayOfTheWeek.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },
    success: function(result) {
        if (result.status.name == "ok") {
            $dayOfTheWeek = result['data']['dayOfTheWeek'];
            $('#day1Weather').html($dayOfTheWeek);
        }}});//Day of the week

$.ajax({
    url: "php/getTomorrowDayOfTheWeek.php",
    type: 'POST',
    dataType: 'json',
    data: {
    },
    success: function(result) {
        if (result.status.name == "ok") {
            $tomorrowDayOfTheWeek = result['data']['dayOfTheWeek'];
            $('#day2Weather').html($tomorrowDayOfTheWeek);
        }}});//Day of the week

$.ajax({
    url: "php/get5DayForecast.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $capital,
    },
    success: function(result) {
        if (result.status.name == "ok") {
            $('#weatherModalLabel').html('5 Day '+$countryName+' Forecast ');
            $condition = result['data']['list'][0]['weather'][0]['main'];
            $day2Condition = result['data']['list'][1]['weather'][0]['main'];
            $day3Condition  = result['data']['list'][2]['weather'][0]['main'];
            $day4Condition  = result['data']['list'][3]['weather'][0]['main'];
            $day5Condition  = result['data']['list'][4]['weather'][0]['main'];
            $('.weatherText').html($condition);


            if($condition === "Rain"){
                $weatherDay1Icon = 'images/rainIcon.png'
            } else if($condition === "Clear"){
                $weatherDay1Icon = 'images/sunIcon.png'
            } else if($condition === "Clouds"){
                $weatherDay1Icon = 'images/cloudIcon.png'
            } else if($condition === "Snow"){
                $weatherDay1Icon  = 'images/snowIcon.png'
            } 
            $('#todayWeatherIcon').html('<img src="' + $weatherDay1Icon + '" class="weatherIcon" />');
            $('#day1WeatherIcon').html('<img src="' + $weatherDay1Icon + '" class="weatherIcon" />');
            console.log($condition);
            if($day2Condition === "Rain"){
                $weatherDay2Icon = 'images/rainIcon.png'
            } else if($$day2Condition === "Clear"){
                $weatherDay2Icon = 'images/sunIcon.png'
            } else if($day2Condition=== "Clouds"){
                $weatherDay2Icon = 'images/cloudIcon.png'
            } else if($day2Condition === "Snow"){
                $weatherDay2Icon = 'images/snowIcon.png'
            } 
            $('#day2WeatherIcon').html('<img src="' +$weatherDay2Icon + '" class="weatherIcon" />');
            $('#day2Text').html($day2Condition);
            console.log($day2Condition);

            if($day3Condition === "Rain"){
                $weatherDay3Icon = 'images/rainIcon.png'
            } else if($day3Condition=== "Clear"){
                $weatherDay3Icon = 'images/sunIcon.png'
            } else if($day3Condition=== "Clouds"){
                $weatherDay3Icon  = 'images/cloudIcon.png'
            } else if($day3Condition === "Snow"){
                $weatherDay3Icon = 'images/snowIcon.png'
            } 
            $('#day3WeatherIcon').html('<img src="' +$weatherDay3Icon + '" class="weatherIcon" />');
            $('#day3Text').html($day3Condition);
            console.log($day3Condition);

            if($day4Condition === "Rain"){
                $weatherDay4Icon = 'images/rainIcon.png'
            } else if($day4Condition === "Clear"){
                $weatherDay4Icon = 'images/sunIcon.png'
            } else if($day4Condition === "Clouds"){
                $weatherDay4Icon = 'images/cloudIcon.png'
            } else if($day4Condition=== "Snow"){
                $weatherDay4Icon = 'images/snowIcon.png'
            } 
            $('#day4WeatherIcon').html('<img src="' +$weatherDay4Icon + '" class="weatherIcon" />');
            $('#day4Text').html($day4Condition);
            console.log($day4Condition);

            if($day5Condition === "Rain"){
                $weatherDay5Icon = 'images/rainIcon.png'
            } else if($day5Condition === "Clear"){
                $weatherDay5Icon = 'images/sunIcon.png'
            } else if($day5Condition === "Clouds"){
                $weatherDay5Icon = 'images/cloudIcon.png'
            } else if($day5Condition === "Snow"){
                $weatherDay5Icon = 'images/snowIcon.png'
            } 
            $('#day5WeatherIcon').html('<img src="' +$weatherDay5Icon+ '" class="weatherIcon" />');
            $('#day5Text').html($day5Condition);
            console.log($day5Condition);

            $kelvin = result['data']['list'][0]['main']['temp'];
            $celsius = $kelvin - 273.15;
            $roundedCelsius = $celsius.toFixed(1);
            $day2Kelvin = result['data']['list'][1]['main']['temp'];
            $day2Celsius = $day2Kelvin - 273.15;
            $day2RoundedCelsius = $day2Celsius.toFixed(1);
            $day3Kelvin = result['data']['list'][2]['main']['temp'];
            $day3Celsius = $day3Kelvin - 273.15;
            $day3RoundedCelsius = $day3Celsius.toFixed(1);
            $day4Kelvin = result['data']['list'][3]['main']['temp'];
            $day4$Celsius = $day4Kelvin - 273.15;
            $day4RoundedCelsius = $day4$Celsius.toFixed(1);
            $day5Kelvin = result['data']['list'][4]['main']['temp'];
            $day5Celsius = $day5Kelvin - 273.15;
            $day5RoundedCelsius = $day5Celsius.toFixed(1);
            $('.weatherTemp').html($roundedCelsius + '<small>&#8451<small>');
            $('#day2Temp').html($day2RoundedCelsius + '<small>&#8451<small>');
            $('#day3Temp').html($day3RoundedCelsius + '<small>&#8451<small>');
            $('#day4Temp').html($day4RoundedCelsius + '<small>&#8451<small>');
            $('#day5Temp').html($day5RoundedCelsius + '<small>&#8451<small>');

            $windSpeed = result['data']['list'][0]['wind']['speed'];
            $day2WindSpeed = result['data']['list'][1]['wind']['speed'];
            $day3WindSpeed = result['data']['list'][2]['wind']['speed'];
            $day4WindSpeed = result['data']['list'][3]['wind']['speed'];
            $day5WindSpeed = result['data']['list'][4]['wind']['speed'];
            $('.weatherWind').html($windSpeed + '<br>km/h');
            $('#day2Wind').html($day2WindSpeed + '<br>km/h');
            $('#day3Wind').html($day3WindSpeed+ '<br>km/h');
            $('#day4Wind').html($day4WindSpeed + '<br>km/h');
            $('#day5Wind').html($day5WindSpeed + '<br>km/h');

    }}});//Country weather

$.ajax({
    url: "php/getCountryPhoto.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $countryName,
    },
    success: function(result) {
        if (result.status.name == "ok") {
            var i, countryImages = '';
            for (i = 0; i < result['data'].length; i++) {
                $countryPhoto = result['data'][i]['webformatURL'];
                countryImages = '<div class="carousel-item"><img class="d-block w-100" src="' + $countryPhoto+ '" id="photo1" alt="First slide"></div>';
                $('#pic1').append('<div class="carousel-item"><img class="d-block w-100" src="' + $countryPhoto+ '" id="photo1" alt="First slide"></div>');
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
            if(result['data'] == undefined || result['data'] == null){
                $covidWorldDead = "N/A";
                $covidWorldConfirmed = "N/A";
                $('#casesWorldTotal').html($covidWorldConfirmed);
                $('#deathsWorldTotal').html($covidWorldDead);
            } else {
                $covidWorldDead = result['data']['TotalDeaths'];
                $covidWorldConfirmed = result['data']['TotalConfirmed'];

                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }

                $covidWorldDead = formatNumber($covidWorldDead)
                $covidWorldConfirmed = formatNumber($covidWorldConfirmed)
                $('#casesWorldTotal').html($covidWorldConfirmed);
                $('#deathsWorldTotal').html($covidWorldDead);
            }}}});

$.ajax({
    url: "php/getCovidByCountry.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $countryName,
    },
    success: function(result) {

        if (result.status.name == "ok") {
            if(result['data'] == undefined || result['data'] == null || result['data']['message'] == "Country not found or doesn't have any cases"){
                    $covidTodayCases = "N/A";
                    $covidTodayDeaths = "N/A";
                    $covidTotalCases = "N/A";
                    $covidTotalDeaths = "N/A";
                    $('#covidHeader').html('Coronavirus<br>' + $countryName);
                    $('#covidNewCases').html($covidTodayCases);
                    $('#covidNewDeaths').html($covidTodayDeaths);
                    $('#casesCountryTotal').html($covidTotalCases);
                    $('#deathsCountryTotal').html($covidTotalDeaths);
            } else {
                $covidTodayCases = result['data']['todayCases'];
                $covidTodayDeaths = result['data']['todayDeaths'];
                $covidTotalCases = result['data']['cases'];
                $covidTotalDeaths = result['data']['deaths'];
                function formatNumber(num) {
                    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                }
                $covidTodayCases = formatNumber($covidTodayCases);
                $covidTodayDeaths = formatNumber($covidTodayDeaths);
                $covidTotalCases = formatNumber($covidTotalCases);
                $$covidTotalDeaths = formatNumber($covidTotalDeaths);

                $('#covidHeader').html('Coronavirus<br>' + $countryName);
                $('#covidNewCases').html($covidTodayCases);
                $('#covidNewDeaths').html($covidTodayDeaths);
                $('#casesCountryTotal').html($covidTotalCases);
                $('#deathsCountryTotal').html($covidTotalDeaths);
                
            }}}})//Covid data

$.ajax({
    url: "php/getCountryNews.php",
    type: 'POST',
    dataType: 'json',
    data: {
        country: $countryISO2,
    },
    success: function(result) {
        if (result.status.name == "ok") {
            if(result['data']['hits'][0] == undefined || result['data']['hits'][0] == null) {
                $('#exampleModalLabel').html($countryName + ' Headlines Not Found!');
            } else {
                $('#exampleModalLabel').html($language + ' Headlines');
                $newsPic1 = result['data']['hits'][0]['imageUrl'];
                $('#newsPics1').attr("src", $newsPic1);
                $newsPic2 = result['data']['hits'][1]['imageUrl'];
                $('#newsPics2').attr("src", $newsPic2);
                $newsPic3 = result['data']['hits'][2]['imageUrl'];
                $('#newsPics3').attr("src", $newsPic3);
                $newsPic4 = result['data']['hits'][3]['imageUrl'];
                $('#newsPics4').attr("src", $newsPic4);
                $newsPic5 = result['data']['hits'][4]['imageUrl'];
                $('#newsPics5').attr("src", $newsPic5);
                $newsPic6 = result['data']['hits'][5]['imageUrl'];
                $('#newsPics6').attr("src", $newsPic6);

                $newsTitle1 = result['data']['hits'][0]['title'];
                $('#title1').html($newsTitle1);
                $newsTitle2 = result['data']['hits'][1]['title'];
                $('#title2').html($newsTitle2);
                $newsTitle3 = result['data']['hits'][2]['title'];
                $('#title3').html($newsTitle3);
                $newsTitle4 = result['data']['hits'][3]['title'];
                $('#title4').html($newsTitle4);
                $newsTitle5 = result['data']['hits'][4]['title'];
                $('#title5').html($newsTitle5);
                $newsTitle6 = result['data']['hits'][5]['title'];
                $('#title6').html($newsTitle6);
                
                $newsurl1 = result['data']['hits'][0]['url'];
                $('#url1').html('<a class="url" href="'+ $newsurl1+'" target="_blank">'+$newsurl1+'</a>');
                $newsurl2 = result['data']['hits'][1]['url'];
                $('#url2').html('<a class="url" href="'+ $newsurl2+'" target="_blank">'+$newsurl2+'</a>');
                $newsurl3 = result['data']['hits'][2]['url'];
                $('#url3').html('<a class="url" href="'+ $newsurl3+'" target="_blank">'+$newsurl3+'</a>');
                $newsurl4 = result['data']['hits'][3]['url'];
                $('#url4').html('<a class="url" href="'+ $newsurl4+'" target="_blank">'+$newsurl4+'</a>');
                $newsurl5 = result['data']['hits'][4]['url'];
                $('#url5').html('<a class="url" href="'+ $newsurl5+'" target="_blank">'+$newsurl5+'</a>');
                $newsurl6 = result['data']['hits'][5]['url'];
                $('#url6').html('<a class="url" href="'+ $newsurl6+'" target="_blank">'+$newsurl6+'</a>');
            }
            }}});//PhotoSlide
    }}});//countryPopup pic
}}});//Country Borders
}}});//country Lat Lng info 
    }}});//news

}}}}})});//Country list info
}).change();//Change/ready function
}}});//Users Country Code PHP
})};//Map

