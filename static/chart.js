const xhr = new XMLHttpRequest();
var data;

function updateChart(){
xhr.open("GET", "http://192.168.1.6:5000/data/");
xhr.send();
xhr.responseType = "json";
xhr.onload = () => {
  if (xhr.readyState == 4 && xhr.status == 200) {
    data = xhr.response;
    console.log(data);
  } else {
    console.log(`Error: ${xhr.status}`);
  }
};
s.data.datasets[0].data = data.y
// s.data.datasets[1].data = data.y
// s.data.datasets[2].data = data.z
s.update()
console.log("Updated")
}

setInterval(function(){updateChart()}, 1000);