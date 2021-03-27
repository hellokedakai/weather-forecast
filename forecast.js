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
        // error handling
        console.log(data);
        if(data.cod === "200") {
            console.log("Valid Input");
        } else if (data.cod === "400") {
            alert(data.message);
        } else if (data.cod === "404") {
            alert(data.message);
        } else if (data.cod === "403") {
            alert(data.message);
        }

        cityToday.innerHTML = data.city.name + " (" +
        moment().format("MM/DD/YY") + ")";

        //get latitude and longitude of the city
        var lat = data.city.coord.lat;
        var lon = data.city.coord.lon;

        populate(lat, lon);
    })
});

//get UV index
function populate(lat, lon) {

    var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +
    "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(oneCallApi)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    
        // get current temperature, humidity, and wind speed
        day0Temp.innerHTML = data.current.temp +" °F";
        day0Humidity.innerHTML = data.current.humidity + " %";
        day0wind.innerHTML = data.current.wind_speed + " MPH";
        day0Uvi.innerHTML = data.current.uvi;

        // get current UVI value and assign colors
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
        for(var i = 0; i < 5; i++) {
            var date = moment().add(i, 'days').format("MM/DD/YY");
            console.log(date);
            var dayTemp = $("<p></p<").text(data.daily[i+1].temp.day);
            var dayHumidity = $("<p></p<").text(data.daily[i+1].humidity);

            //create each day's elements
            var dayBox = $("#day" + i + 1);
            dayBox.append(dayTemp, dayHumidity);

        }



    })

   
    
}