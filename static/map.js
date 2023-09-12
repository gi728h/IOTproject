//var locatorIcon = L.icon({
//    iconUrl: '',
//
//    iconSize:     [38, 38], // size of the icon
//    iconAnchor:   [22, 22], // point of the icon which will correspond to marker's location
//    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
//});
var moderateIcon = L.icon({
    iconUrl: 'https://i.imgur.com/Kz73Sjr.png',

    iconSize:     [20, 20], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var severeIcon = L.icon({
    iconUrl: 'https://i.imgur.com/h97mGZu.png',

    iconSize:     [20, 20], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
//var locator = L.marker([51.5, -0.09], {icon: locatorIcon}).addTo(map).bindPopup("You Are here");
var lenM = 0
var lenS = 0
const vhr = new XMLHttpRequest();
const dhr = new XMLHttpRequest();
var data;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function updateChart(){
vhr.open("GET", "http://192.168.1.6:5000/data/");
vhr.send();
vhr.responseType = "json";
vhr.onload = () => {
  if (vhr.readyState == 4 && vhr.status == 200) {
    data = vhr.response;
    var newCenter = L.latLng(data.lat[0],data.lon[0]);
    map.setView(newCenter);
//    console.log(data);
  } else {
    console.log(`Error: ${vhr.status}`);
  }
};

//locator.setLatLng(newCenter);

//console.log("Updated")
dhr.open("GET", "http://192.168.1.6:5000/markers");
dhr.send();
dhr.responseType = "json";
dhr.onload = () => {
  if (dhr.readyState == 4 && dhr.status == 200) {
    data = dhr.response;
    if(data.moderate.x.length != lenM){
    for(var a = 0;a < data.moderate.x.length;a++){
    lat = data.moderate.x[a]
    lon = data.moderate.y[a]
    L.marker([lat, lon], {icon: moderateIcon}).addTo(map).bindPopup(lat,lon);
    }
    lenM = data.moderate.x.length;
    }
    console.log(data.moderate.x.length)
if(data.severe.x.length != lenS){
    for(var a = 0;a < data.severe.x.length;a++){
    lat = data.severe.x[a]
    lon = data.severe.y[a]
    L.marker([lat, lon], {icon: severeIcon}).addTo(map).bindPopup(lat,lon);
    }
    lenS = data.severe.x.length;
    }
    console.log(data);
  } else {
    console.log(`Error: ${dhr.status}`);
  }
};

}


setInterval(function(){updateChart()}, 1000);
