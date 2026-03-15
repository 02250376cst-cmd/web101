// Configuration and Constants
const WEATHER_API_KEY = "235e1c92ba11d7a15262bbd96078a26c"; // Replace with your actual API key
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const PLACEHOLDER_API_URL = "https://jsonplaceholder.typicode.com/posts";

// Global state
let savedLocations = [];

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {

const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
tab.addEventListener("click", () => {

const tabId = tab.getAttribute("data-tab");

tabs.forEach(t => t.classList.remove("active"));
tab.classList.add("active");

document.querySelectorAll(".tab-content").forEach(content => {
content.classList.remove("active");
});

document.getElementById(`${tabId}-tab`).classList.add("active");

});
});

document.getElementById("get-weather").addEventListener("click", getWeather);
document.getElementById("save-location").addEventListener("click", saveLocation);
document.getElementById("update-location").addEventListener("click", updateLocation);

document.getElementById("cancel-edit").addEventListener("click", () => {
document.getElementById("edit-modal").style.display = "none";
});

fetchSavedLocations();

});


// Display API response information
function displayResponseInfo(method, url, status, data){

const responseInfo = document.getElementById("response-info");

responseInfo.textContent =
`Method: ${method}
URL: ${url}
Status: ${status}
Timestamp: ${new Date().toLocaleString()}

Data:
${JSON.stringify(data,null,2)}`;

}



// GET WEATHER
async function getWeather(){

const cityInput = document.getElementById("city-input");
const city = cityInput.value.trim();

if(!city){
alert("Please enter a city name");
return;
}

const weatherResult = document.getElementById("weather-result");
weatherResult.innerHTML="Loading...";

try{

const url =
`${WEATHER_API_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;

const response = await fetch(url);
const data = await response.json();

displayResponseInfo(
"GET",
url.replace(WEATHER_API_KEY,"API_KEY_HIDDEN"),
response.status,
data
);

if(!response.ok){
throw new Error(data.message || "Failed to fetch weather data");
}

weatherResult.innerHTML = `
<div class="weather-card">
<h3>${data.name}, ${data.sys.country}</h3>

<p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>

<p><strong>Temperature:</strong> ${data.main.temp}°C
(Feels like ${data.main.feels_like}°C)</p>

<p><strong>Humidity:</strong> ${data.main.humidity}%</p>

<p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
</div>
`;

}
catch(error){

weatherResult.innerHTML =
`<div class="weather-card" style="border-left-color:red">
Error: ${error.message}
</div>`;

}

}



// POST LOCATION
async function saveLocation(){

const name = document.getElementById("location-name").value.trim();
const city = document.getElementById("location-city").value.trim();
const country = document.getElementById("location-country").value.trim();
const notes = document.getElementById("location-notes").value.trim();

if(!name || !city){
alert("Please enter at least a name and city");
return;
}

try{

const response = await fetch(PLACEHOLDER_API_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title:name,
body:JSON.stringify({city,country,notes}),
userId:1
})

});

const data = await response.json();

displayResponseInfo("POST",PLACEHOLDER_API_URL,response.status,data);

if(!response.ok){
throw new Error("Failed to save location");
}

savedLocations.push({
id:data.id,
name,
city,
country,
notes
});

renderSavedLocations();

document.getElementById("location-name").value="";
document.getElementById("location-city").value="";
document.getElementById("location-country").value="";
document.getElementById("location-notes").value="";

document.querySelector('.tab[data-tab="saved"]').click();

}
catch(error){
alert("Error: "+error.message);
}

}



// FETCH SAVED LOCATIONS
async function fetchSavedLocations(){

try{

const response = await fetch(`${PLACEHOLDER_API_URL}?userId=1`);
const data = await response.json();

savedLocations = data.slice(0,5).map(item=>{

let city="";
let country="";
let notes="";

try{
const body = JSON.parse(item.body);
city = body.city || "Unknown City";
country = body.country || "";
notes = body.notes || "";
}
catch(e){
city="Unknown City";
notes=item.body;
}

return{
id:item.id,
name:item.title,
city,
country,
notes
};

});

renderSavedLocations();

}
catch(error){
console.error("Error fetching saved locations:",error);
}

}



// DISPLAY SAVED LOCATIONS
function renderSavedLocations(){

const container = document.getElementById("saved-locations");

if(savedLocations.length===0){
container.innerHTML="<p>No saved locations yet</p>";
return;
}

container.innerHTML = savedLocations.map(location =>

`
<div class="location-item">

<h3>${location.name}</h3>

<p><strong>City:</strong> ${location.city}</p>

${location.country ? `<p><strong>Country:</strong> ${location.country}</p>` : ""}

${location.notes ? `<p>${location.notes}</p>` : ""}

<div class="location-actions">

<button onclick="editLocation(${location.id})">Edit</button>

<button class="btn-delete" onclick="deleteLocation(${location.id})">
Delete
</button>

</div>

</div>
`

).join("");

}



// EDIT LOCATION
function editLocation(id){

const location = savedLocations.find(loc=>loc.id===id);

if(!location) return;

document.getElementById("edit-id").value = location.id;
document.getElementById("edit-name").value = location.name;
document.getElementById("edit-city").value = location.city;
document.getElementById("edit-country").value = location.country;
document.getElementById("edit-notes").value = location.notes;

document.getElementById("edit-modal").style.display="block";

}



// PUT UPDATE LOCATION
async function updateLocation(){

const id = document.getElementById("edit-id").value;

const name = document.getElementById("edit-name").value.trim();
const city = document.getElementById("edit-city").value.trim();
const country = document.getElementById("edit-country").value.trim();
const notes = document.getElementById("edit-notes").value.trim();

if(!name || !city){
alert("Please enter at least a name and city");
return;
}

try{

const response = await fetch(`${PLACEHOLDER_API_URL}/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
id,
title:name,
body:JSON.stringify({city,country,notes}),
userId:1
})

});

const data = await response.json();

displayResponseInfo("PUT",`${PLACEHOLDER_API_URL}/${id}`,response.status,data);

if(!response.ok){
throw new Error("Failed to update location");
}

const index = savedLocations.findIndex(loc=>loc.id===parseInt(id));

if(index !== -1){
savedLocations[index] = {id:parseInt(id),name,city,country,notes};
}

renderSavedLocations();

document.getElementById("edit-modal").style.display="none";

}
catch(error){
alert("Error: "+error.message);
}

}



// DELETE LOCATION
async function deleteLocation(id){

if(!confirm("Are you sure you want to delete this location?")){
return;
}

try{

const response = await fetch(`${PLACEHOLDER_API_URL}/${id}`,{
method:"DELETE"
});

displayResponseInfo(
"DELETE",
`${PLACEHOLDER_API_URL}/${id}`,
response.status,
{message:"Resource deleted successfully"}
);

if(!response.ok){
throw new Error("Failed to delete location");
}

savedLocations = savedLocations.filter(loc=>loc.id!==id);

renderSavedLocations();

}
catch(error){
alert("Error: "+error.message);
}

}