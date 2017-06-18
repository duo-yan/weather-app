var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;
var APPID = "e9e239c6585f081bee7b0d7f6045a53f";

function updateByCityName(q){
	var url = "http://api.openweathermap.org/data/2.5/weather?q={" + 
				q + 
				"}&APPID=" + APPID;
	sendRequest(url);
}

function updateByGeo(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?" + 
				"lat=" + lat +
				"&lon=" + lon +
				"&APPID=" + APPID;
	sendRequest(url);
}

function showPosition(position){
	updateByGeo(position.coords.latitude, position.coords.longitude);
}

function sendRequest(url){
	var xmlhttp = new XMLHttpRequest ();
	xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var data = JSON.parse(xmlhttp.responseText);
				var weather = {};
				weather.icon = data.weather[0].id;
				weather.temp = K2C(data.main.temp);
				weather.humidity = data.main.humidity;
				weather.wind = data.wind.speed;
				weather.direction = degToDirection(data.wind.deg);
				weather.loc = data.name;
				update(weather);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
}

function update(weather){
	temp.innerHTML = weather.temp;
	loc.innerHTML = weather.loc;
	icon.src = "imgs/codes/" + weather.icon + ".png";
	humidity.innerHTML = weather.humidity;
	wind.innerHTML = weather.wind;
	direction.innerHTML = weather.direction;
}



window.onload = function () {
	temp = document.getElementById("temperature");
	loc = document.getElementById("location");
	icon = document.getElementById("icon");
	humidity = document.getElementById("humidity");
	wind = document.getElementById("wind");
	direction = document.getElementById("direction");
	
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	else{
		var q = window.prompt("Could not detect your location. Enter city name");
		updateByCityName(q);
	}
}

//kelvin to celcius
function K2C(k){
	return Math.round(k - 273.15);
}

function degToDirection(degrees){
	var revolution = 360;
	var numDirectionn = 8;
	var range = revolution/numDirectionn;
	
	var low = revolution - range/2;
	var high = (low + range) % revolution;
	var angles = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	for (i in angles){	
		if(degrees >= low && degrees < high){
			return angles[i];
		}
		low = (low + range) % revolution;
		high = (high + range) % revolution;
	}
}
