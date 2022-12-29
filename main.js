

// variables that will be referrenced later
const search = document.getElementById("searchBar");
const button = document.getElementById("smtBtn");
const searchHistory = document.getElementById("historyStorage");
const cards = document.getElementById("boxes");
// this counter will be the key digit for local storage reference
let counter;

// something weird happens when you reload page, counter overrides previously saved input
// this checks to make sure that nothing is in storage and assigns 0 to counter
if (localStorage.length == 0) {
    counter = 0;
// otherwise counter gets assigned a number to pick up where it left off assigning info
} else {
    counter = localStorage.length + 1;
}
console.log("counter equals: " + counter);


// create an object with all related methods and attributes

let weather = {
    // this is the api key that will be used to retrieve data
    "apiKey": "e9efaaef8e82106189162a5b96ae9619",

    // fetch API method that will parse data 
    fetchInfo: function(city) {
        // variables set to imperial units 
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${this.apiKey}`)
        .then((response) => response.json())
        // used a console.log to check that data was parsed properly, will leave here in case I need to check again
        // .then((data) =>console.log(data))
        .then((data)=> this.displayInfo(data))
        // handle error
        .catch(error=> console.error(`Looks like something went wrong: ${error}`));
    },
    // this function creates variables to be used and display in front-end
    displayInfo: function(data) {
        // variables of data
        const { name } = data;
        const {icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        // log the info
        console.log(name, icon, description, temp, humidity, speed);
        // update the page with given names 
        document.getElementById("cityName").innerText = "Weather in " + name;
        document.getElementById("imageIcon").src = "http://openweathermap.org/img/wn/" + icon + ".png";
        document.getElementById("iconDescription").innerText = description;
        document.getElementById("temp").innerText = "Temperature is " + temp + " °F"
        document.getElementById("windSpeed").innerText = "Wind speed is " + speed + " miles per hour"
        document.getElementById("humidity").innerText = "Humidity is " + humidity + "%"
    },
    // function that searches based on the on the input on search bar
    weatherSearch: function(city) {        
        this.fetchInfo(city);        
    },
     
    fiveDayInfo: function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?&daily&units=imperial&q=${city}&appid=${this.apiKey}`)
        .then((response) => response.json())
        // used a console.log to check that data was parsed properly, will leave here in case I need to check again
        // .then((data) =>console.log(data))
        .then((data)=> this.displayFiveDay(data))
        // handle error
        .catch(error=> console.error(`Looks like something went wrong: ${error}`));

    },
    displayFiveDay: function(data) {
        // this checks to make sure that the cards do not keep stacking on and getting
        // added to the div that holds the 5 day weather, and old data doesn't remain.
        if (cards.length !=0) {
            cards.innerHTML = "";
        }

        let j= 0;
        for(let i = 0; i < 40; i+=8) {
            const { dt_txt } = data.list[i];
            const { temp, humidity } = data.list[i].main;
            const { speed } = data.list[i].wind;
            const { icon, description } = data.list[i].weather[0];
        console.log( dt_txt, "temp: " + temp, description, icon, "humidity: " + humidity, "wind speed: " +  speed);

        let newDiv = document.createElement("div");
        newDiv.setAttribute("id", "dayBox");
        let date = document.createElement("h2");
        // this flips the order of the info using substring and concactenating
        date.innerHTML += dt_txt.substring(5,10)+ "-"+ dt_txt.substring(0,4);
        let forecastIcon = document.createElement("img");
        forecastIcon.src = "http://openweathermap.org/img/wn/" + icon + ".png";  
        let iconDescription = document.createElement("h3");
        iconDescription.innerHTML += description;      
        let temperature = document.createElement("p");
        temperature.innerHTML += "Temp: " + temp + " °F";
        let hum = document.createElement("p");
        hum.innerHTML += "Humidity: " + humidity + "%";
        let windSpeed =  document.createElement("p");
        windSpeed.innerHTML += "Wind speed:" + temp + " miles/hour";
        
        // add created elements to new Div
        newDiv.append(date);
        newDiv.append(forecastIcon);
        newDiv.append(iconDescription);
        newDiv.append(temperature);
        newDiv.append(hum);
        newDiv.append(windSpeed);
        cards.append(newDiv);
    }}
};

// listener for submit button
button.addEventListener("click", function() {
    // runs search function
    weather.weatherSearch(search.value);
    weather.fiveDayInfo(search.value);
    //creates a new div and attributes to add to Div in history page
    let newDiv = document.createElement("div");
    newDiv.innerHTML+= search.value;
    newDiv.setAttribute("id", "searchHistory");
    searchHistory.append(newDiv);

    // adds items to local storage
    localStorage.setItem( counter, search.value);
    // resets the value in the search bar to blank
    search.value = "";
    // adds 1 to the counter that is used as key reference on local storage object
    counter++;
    
    console.log(newDiv);
    console.log(localStorage);

});
// this for loop prints out the items in local storage when page is loaded
for (let i = 0; i < localStorage.length; i++) {
    // here the div is created and the key value pairs assigned and added to the history div
    // this info repeats twice and could be made a little DRY but its not worth the effort 
    // since it is only used 2 times
    const key = localStorage.key(i);
    const pairValue = localStorage.getItem(key);
    let newDiv = document.createElement("div");
    newDiv.innerHTML+= pairValue;
    newDiv.setAttribute("id", "searchHistory");
    searchHistory.appendChild(newDiv);
 };
 // create an Array to iterate through with a call back function that adds event listeners
 // to all divs with the id carrying the search history
 let searches = Array.from(document.querySelectorAll("#searchHistory"));
 searches.forEach(choice => {
    console.log(choice);
    choice.addEventListener("click", (event) => {
        let newSearch = event.target;
        
        weather.weatherSearch(newSearch.innerText);
        weather.fiveDayInfo(newSearch.innerText);
    })
 });



