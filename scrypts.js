const monthArr = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getWeather(location){
   let latitude = location.latitude;
   let longitude = location.longitude;
   let lat_box = document.getElementById("lat")
   let lon_box = document.getElementById("lon")
   
   lat_box.innerHTML = location.latitude
   lon_box.innerHTML = location.longitude

   loadingToggle()
   return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c708b1623179bb92fb6654448ed0ba58&units=metric`)
   .then(response => response.json())
}

function getWeatherDates(location){
   let latitude = location.latitude;
   let longitude = location.longitude;

   loadingToggle()
   return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=c708b1623179bb92fb6654448ed0ba58&units=metric`)
   .then(response => response.json())
}

function renderTodayWeather(data){
   document.getElementById("city").innerHTML = data.name
   
   loadingToggle();

   console.log(data)

   var date = new Date(data.dt * 1000),
   month = date.getMonth(),
   monthFull = monthArr[month];
   
   console.log("rrr",   date.toDateString())
   console.log("rrr",   date.getDate())
   console.log("rrr", monthFull)
   let html = ` 
      <div class="card weather-today">
         <div class="date">
            ${date.getDate()} ${monthFull} (Today)
         </div>
         <div class="icon">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
         </div>
         <h4 class="temp">Temperature ${Math.round(data.main.temp)}</h4>
         <span class="feels">Feels like ${Math.round(data.main.feels_like)}</span>
         <span class="wind">Wind speed ${data.wind.speed}</span>
      </div>
      <div class="card card-more" onclick="displayMoreWeather()">
         <img src="img/plus-circle.svg" />
      </div>
      `;
   document.getElementById("weather").innerHTML = html
}

function displayMoreWeather(){
   getLocationPromise.then(location => getWeatherDates(location)).then((response)=>{
      console.log("days",response)
      console.log("days",response.daily[0])

      for(let i=1,j=response.daily.length; i<j; i++){
         console.log(response.daily[i])
         let day = response.daily[i];
         var date = new Date(response.daily[i].dt * 1000),
         month = date.getMonth(),
         monthFull = monthArr[month];
         
         console.log("toDateString",   date.toDateString())
         console.log("getDate",   date.getDate())
         console.log("monthFull", monthFull)

         let html = ` 
         <div class="card">
            <div class="date">
               ${date.getDate()} ${monthFull}
            </div>
            <div class="icon">
               <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
            </div>
            <h4 class="temp">Temperature ${Math.round(day.temp.day)}</h4>
            <span class="feels">Feels like ${Math.round(day.feels_like.day)}</span>
            <span class="wind">Wind speed ${day.wind_speed}</span>
         </div>`;
         document.getElementsByClassName("card-more")[0].style.display="none";
         document.getElementById("weather").innerHTML += html
      }

      loadingToggle()
   })
}

function loadingToggle(){
   let spinner = document.getElementById("spinner");
   spinner.hasAttribute("hidden") ? spinner.removeAttribute('hidden') : spinner.setAttribute('hidden', '');
}

let getLocationPromise = new Promise((resolve, reject) => {
   if(navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function (position) {

           lat = position.coords.latitude
           long = position.coords.longitude
           resolve({latitude: lat, 
                   longitude: long})
       })

   } else {
       reject("your browser doesn't support geolocation API")
   }
})

getLocationPromise.then(location => getWeather(location)).then(response => renderTodayWeather(response)).then(location => getWeatherDates(location))
.catch((err) => {
   console.log(err)
})


