// search for a city section
var cityInput = document.querySelector(".form-control");
var apiKey = "9c74928d78e0aadb457195cd716eef1e";

//current weather variables
var today = document.getElementById("day0");
var cityToday = document.getElementById("city-today");
var day0Temp = document.getElementById("day0-temp");
var day0Humidity = document.getElementById("day0-humidity");
var day0wind = document.getElementById("day0-wind");
var day0Uvi = document.getElementById("day0-uvi");
var day0UviVal = document.getElementById("day0-uvi");


//5-day forecast variables
var day1Temp = document.getElementById("day1");
var day2Temp = document.getElementById("day2");
var day3Temp = document.getElementById("day3");
var day4Temp = document.getElementById("day4");
var day5Temp = document.getElementById("day5");


// upon click of the search button, call API
$("span").on("click", function() {
    // get the input value of the searched city
    var city = cityInput.value.trim();
    var callApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +
    "&units=imperial&appid=" + apiKey;
    
    // fetch
    fetch(callApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        // console.log(data);
        // error handling
        var cityName = data.city.name;
        
        if(data.cod === "200") {
            console.log("Valid Input"); 
        } else if (data.cod === "400") {
            alert(data.message);
        } else if (data.cod === "404") {
            alert(data.message);
        } else if (data.cod === "403") {
            alert(data.message);
        }

        // place current city name
        cityToday.innerHTML = cityName;

        //get latitude and longitude of the city
        var lat = data.city.coord.lat;
        var lon = data.city.coord.lon;

        populate(lat, lon);
        // save city to local storage
        searchHistory(cityName);
    })
});

function searchHistory (cityName) {
    var duplicateFound;
    // var cityArray = [];
    var justSearchedCity = {
        city : cityName,
    };
    var cityArray = JSON.parse(localStorage.getItem("savedCity") || "[]");
          
    // save the just searched city if it's not a duplicate
    for(var i = 0; i < cityArray.length; i++){
        if(cityArray[i].city === cityName){
            console.log(cityArray[i].city);
            duplicateFound = true;
        }
    }
    // if the city isn't a duplicate search, push to array and search history
    if(!duplicateFound){
        cityArray.push(justSearchedCity);
        localStorage.setItem("savedCity", JSON.stringify(cityArray));
        displayHistory(cityName);
    }
};

function displayHistory(cityName) {
    var history = document.querySelector(".search-history");
    console.log(cityName);
    var historyCity = $("<ul>" + cityName + "</ul>");
    history.append(historyCity);
}

// function renderCity(){
//     var cityArray=[];
//     if (localStorage.savedCity) {
//       history.innerHTML="";
//       var cityArray = JSON.parse(localStorage.getItem("savedCity"));
//       console.log(cityArray.length);
//       for(var i=0; i < cityArray.length; i++){
       
//           console.log(cityArray[i].city);
//           var liCityEl = document.createElement('button');
//           liCityEl.type = 'button';
//           liCityEl.classList.add("list-group-item");
//           liCityEl.classList.add("list-group-item-action");
//           liCityEl.textContent = cityArray[i].city;
//           history.appendChild(liCityEl);
          
//       }
      
      
//     }



//get values from second API
function populate(lat, lon) {

    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +
    "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(oneCallApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        // console.log(data.timezone);

        //get city's timezone
        cityToday.innerHTML += " (" +
        moment().tz(data.timezone).format('l') + ")";


        // get current temperature, humidity, and wind speed
        day0Temp.innerHTML = data.current.temp +" °F";
        day0Humidity.innerHTML = data.current.humidity + " %";
        day0wind.innerHTML = data.current.wind_speed + " MPH";
        day0Uvi.innerHTML = data.current.uvi;

        // get current UV index value and assign colors
        if(data.current.uvi < 3) {
            day0Uvi.setAttribute("class", "favorable");
        }
        else if (data.current.uvi >= 3 && data.current.uvi < 6) {
            day0Uvi.setAttribute("class", "moderate");
        }
        else if (data.current.uvi >= 6) {
            day0Uvi.setAttribute("class", "severe");
        }

        //get 5day forecast
        for(var i = 1; i <= 5; i++) {

            //get date, temp, and humidity
            var date = moment().tz(data.timezone).add(i, 'days').format('l');
            var dayTemp = $("<p></p>").text("Temp: " + data.daily[i].temp.day +" °F");
            var dayHumidity = $("<p></p>").text("Humidity: " + data.daily[i].humidity + " %");

            //append to date's box
            var dayBox = $("#day" + i);
            dayBox.append(date, dayTemp, dayHumidity);

        }
    })   
}

