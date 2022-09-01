// Create an object that will store the current user's location
let userLocationCoordinates ={
    name:'NBO',
    latitude:-1.2802,
    longitude:36.8346
};
document.addEventListener('DOMContentLoaded',getLocation()
)
function OpenStreetMapLayer(){
    //Let the map be loaded once the 
    let map =L.map('map')// to innitialize the map on our page
    let userLocation = [userLocationCoordinates.latitude, userLocationCoordinates.longitude] /* fetchPreviousLocation() */ // later change the user location to the previously stored location for the user
    map.setView(userLocation,12); 

    //fetch and add a tile layer openstreetmap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
    ', Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>',
    maxZoom:12
    }).addTo(map)


    //create a marker on current user's location
    let marker= L.marker([userLocationCoordinates['latitude'],userLocationCoordinates['longitude']]).addTo(map);
    // add popup to the marker
    marker.bindPopup(userLocationCoordinates['name'])
    // add event listener to the pin location element
    // When clicked the user location is captured and displayed on the map
    let pinLocation = document.querySelector('#pin-location-button')
    pinLocation.addEventListener('click', e=>getLocation(e))
}
setTimeout(OpenStreetMapLayer(),100)

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
        console.log(userLocationCoordinates.latitude)
      };
    // define function error that is executed when the getCurrentPosition  
      function error() {
        alert("Your browser does not support geolocation");
      };
    console.log(`${userLocationCoordinates.latitude} outside positionn`)
};

//Button that store the user location
let bookMarkLocation = document.querySelector('#submi-location')
bookMarkLocation.addEventListener('click',e=>captureUserLocation(e))
//Define the capture user location data and geocode to latitudes and longitude
function captureUserLocation(e){
    //create a form that the user will fill to bookmark location
    let form = document.createElement('form')
    let nameInput = document.createElement('input')
    let submit = document.createElement('input')
    submit.type="submit" 
    submit.value="Submit"
    nameInput.type="text"
    nameInput.name="location name"
    form.appendChild(nameInput)
    form.appendChild(submit)
    document.querySelector('#user-data').appendChild(form)

    // then add event listener to the form
    // Take the passed name and pass it to the name property in the userlocation object
    form.addEventListener('submit',e=>{
        userLocationCoordinates.name = e.target.children[0]
    })
    //push the new user coordinates to db.json file
    fetch('http://localhost:3000/userLocations',{
        method: 'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(userLocationCoordinates)
    }).then(alert('Your location BookMarked'))
}

// write code that will enable the user to search location by name
let trail = document.querySelector('#trail')
// add eventListener
trail.addEventListener('submit',e=>showTrail(e))
// Display all the coordinates that has been bookmarked by the user
//fetch data from the server
function showTrail(){
    fetch('http://localhost:3000/userLocations').then(res =>res.json()).then(data =>{
        data.forEach(location =>L.marker([location.latitude,location.longitude]).addTo(map))
    })
}
