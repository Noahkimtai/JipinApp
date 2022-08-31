//Let the map be loaded once the 
let map =L.map('map')// to innitialize the map on our page
document.addEventListener('DOMContentLoaded', e=>{
    let userLocation = [-1.2802, 36.8346] /* fetchPreviousLocation() */ // later change the user location to the previously stored location for the user
    map.setView(userLocation,17); 

    //add a tile laye openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
    ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
    maxZoom:18
    }).addTo(map)
})
// Create an object that will store the current user's location
let userLocationCoordinates ={
    name:'NBO',
    latitude:-1.2802,
    longitude:36.8346
}
//create a marker on current user's location
let marker= L.marker([userLocationCoordinates['latitude'],userLocationCoordinates['longitude']]).addTo(map);

// add event listener to the pin location element
// When clicked the user location is captured and displayed on the map
let pinLocation = document.querySelector('#pin-location-button')
pinLocation.addEventListener('click', e=>getLocation(e))


function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);// function for getting the user location
    } else {
    alert("Geolocation is not supported by this browser");
    }
    // define function success (what is executed if the getCurrentPosition function does not return error)
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        userLocationCoordinates.latitude=latitude;
        userLocationCoordinates.longitude=longitude;
      };
    // define function error that is executed when the getCurrentPosition  
      function error() {
        alert("Your browser does not support geolocation");
      };
}

//Button that store the user location
let bookMarkLocation = document.querySelector('#submi-location')
bookMarkLocation.addEventListener('click',e=>captureUserLocation(e))
//Define the capture user location data and geocode to latitudes and longitude
function captureUserLocation(e){
    //push the new user coordinates to db.json file
    fetch('http://localhost:3000/userLocations',{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(userLocationCoordinates)
    }).then(getLocationName()).then(alert('Your location BookMarked'))
}

/* Reverse Geocode to get the name of the area whose coordinates has been CanvasCaptureMediaStreamTrack. */
function getLocationName(){
    //reverse geocode to get name from the coordinats
}

// Display all the coordinates that has been bookmarked by the user
//fetch data from the server
function displayBookMarkedLocations(){
    fetch('http://localhost:3000/userLocations').then(res =>res.json()).then(data =>{
        data.forEach(location =>L.marker([location.latitude,location.longitude]).addTo(map))
    })
}