
function getWeather(location){
   let latitude = location.latitude;
   let longitude = location.longitude;
   let lat_box = document.getElementById("lat")
   let lon_box = document.getElementById("lon")
   
   lat_box.innerHTML = location.latitude
   lon_box.innerHTML = location.longitude

   return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c708b1623179bb92fb6654448ed0ba58&units=metric`).then(response => response.json())
}

let getLocationPromise = new Promise((resolve, reject) => {
   if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function (position) {

           let spinner = document.getElementById("spinner");
           spinner.removeAttribute('hidden');  

           lat = position.coords.latitude
           long = position.coords.longitude
           resolve({latitude: lat, 
                   longitude: long})
       })

   } else {
       reject("your browser doesn't support geolocation API")
   }
})


getLocationPromise.then(location => getWeather(location)).then((response)=>{
   document.getElementById("city").innerHTML = response.name
   spinner.setAttribute('hidden', '');
   console.log(response)
   console.log("GGg",response.main.temp)
   console.log("icon", `http://openweathermap.org/img/wn/${response.weather.icon}@2x.png`)
}).catch((err) => {
   console.log(err)
})


