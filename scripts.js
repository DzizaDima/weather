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

function getCurrencies(){
  return fetch(`http://data.fixer.io/api/latest?access_key=ff29ea98db8265fd2014df21e97bb6a7&base=EUR&symbols=UAH,RUB,USD`)
   .then(response => response.json())
}

function renderTodayWeather(data){
   document.getElementById("city").innerHTML = data.name
   loadingToggle();

   var date = new Date(data.dt * 1000),
   month = date.getMonth(),
   monthFull = monthArr[month];
   let html = ` 
      <div class="card weather-today">
         <div class="date">
            ${date.getDate()} ${monthFull} (Today)
         </div>
         <div class="icon">
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
         </div>
         <h4 class="sky-weather">${data.weather[0].description}</h4>
         <h4 class="temp">Temperature ${Math.round(data.main.temp)}°</h4>
         <span class="feels">Feels like ${Math.round(data.main.feels_like)}°</span>
         <span class="wind">Wind speed ${data.wind.speed.toFixed(1)}</span>
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
         let day = response.daily[i];
         var date = new Date(response.daily[i].dt * 1000),
         month = date.getMonth(),
         monthFull = monthArr[month];

         let html = ` 
         <div class="card">
            <div class="date">
               ${date.getDate()} ${monthFull}
            </div>
            <div class="icon">
               <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
            </div>
            <h4 class="sky-weather">${day.weather[0].description}</h4>
            <div class="day-temp">
               <span class="label">Morning</span><span class="value">${Math.round(day.temp.morn)}°</span>
               <span class="label">Day</span> <span class="value">${Math.round(day.temp.day)}°</span>
               <span class="label">Evening</span> <span class="value">${Math.round(day.temp.eve)}°</span>
               <span class="label">Night</span><span class="value">${Math.round(day.temp.night)}°</span>
            </div>
            <span class="wind">Wind speed ${day.wind_speed.toFixed(1)}</span>
         </div>`;
         document.getElementsByClassName("card-more")[0].style.display="none";
         document.getElementById("weather").innerHTML += html
      }

      loadingToggle()
   })
}

function renderCurrency(){
  getCurrencies().then((response) => {
      let uah = response.rates.UAH.toFixed(2),
      rub = response.rates.RUB.toFixed(2),
      usd = response.rates.USD.toFixed(2),
      eur = response.base;

      let usd_uah = uah / usd,
      usd_rub = rub / usd,
      usd_eur = 1 / usd;

     let html= `
     <div class="block">
        <h3 class="main">${response.base}</h3>
        <div class="sub">
         <div class="one-curr">
            <span class="title">UAH</span>
            <span class="value">${uah}</span>
         </div>
         <div class="one-curr">
            <span class="title">RUB</span>
            <span class="value">${rub}</span>
         </div>
         <div class="one-curr">
            <span class="title">USD</span>
            <span class="value">${usd}</span>
         </div>
        </div>
     </div>
     <div class="block">
      <h3 class="main">USD</h3>
      <div class="sub">
         <div class="one-curr">
            <span class="title">UAH</span>
            <span class="value">${usd_uah.toFixed(2)}</span>
         </div>
         <div class="one-curr">
            <span class="title">RUB</span>
            <span class="value">${usd_rub.toFixed(2)}</span>
         </div>
         <div class="one-curr">
            <span class="title">EUR</span>
            <span class="value">${usd_eur.toFixed(2)}</span>
         </div>
      </div>
   </div>
     `
     document.getElementsByClassName("currency__body")[0].innerHTML += html
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



getLocationPromise.then(location => getWeather(location)).then(response => renderTodayWeather(response)).then(renderCurrency())
.catch((err) => {
   console.log(err)
})


