var favMap;
var infoWindow = new google.maps.InfoWindow();
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer({
  polylineOptions: {
    strokeColor: 'orange'
  }
});
function initFavMap() {
  // set LatLng to SF
  var sfLatLng = {
    lat: 36.07094,
    lng: - 79.296201
  };
  // create a map object and specify the DOM element for display
  // map appears in map.html
  favMap = new google.maps.Map(document.getElementById('map'), {
    center: sfLatLng,
    scrollwheel: true,
    zoom: 13,
    zoomControl: true,
    panControl: true,
    streetViewControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  locateUser();
  //getFavoriteSpots();
}
function addInfoWindowFavoritePlaces(lat, long) {
  // var fav_html = '<div class="content">' +
  // '<button type="button" onclick="createFavoriteSpot(' + lat +
  // ', \'{lat: ' + lat + ', lng: ' + long + '}\')" class="btn btn-primary" id="fav-button">' +
  // 'Favorite</button>' +
  // '</div>';
  var contentString = '<div id="content">' +
  '<div id="siteNotice">' +
  '</div>' +
  '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
  '<div id="bodyContent">' +
  '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  'sandstone rock formation in the southern part of the ' +
  'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
  'south west of the nearest large town, Alice Springs; 450&#160;km ' +
  '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
  'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
  'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
  'Aboriginal people of the area. It has many springs, waterholes, ' +
  'rock caves and ancient paintings. Uluru is listed as a World ' +
  'Heritage Site.</p>' +
  '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
  'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
  '(last visited June 22, 2009).</p>' +
  '</div>' +
  '</div>';
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener('click', function () {
    infowindow.open(map, favMark);
  });
}; // End of addInfoWindowFavoritePlaces
// this gets called when you click the fav-button rendered in InfoWindow
function locateUser() {
  var browserSupportFlag = new Boolean();
  if (navigator.geolocation) {
    /* geolocation is available */
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      //debugger();
      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      //favMap.setCenter(pos);
      var favMark = new google.maps.Marker({
        map: favMap,
        position: new google.maps.LatLng(lat, long),
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'
      });
      // Call function to display pop up to save place as favorite
      debugger
      addInfoWindowFavoritePlaces(lat, long, favMark);
      window.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // anything that needs to ref userLocation MUST happen before the end of this function
    }, function () {
      handleNoGeolocation(browserSupportFlag);
    });
  } // end if
  // browser doesn't support Geolocation so call the handleNoGeolocation fn
   else {
    /* geolocation is not available */
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
} // end of function locateUser

function handleNoGeolocation(errorFlag) {
  if (errorFlag == true) {
    alert('Geolocation service failed.');
  } else {
    alert('Your browser does not support geolocation.');
  }
}
$(document).ready(function () {
  google.maps.event.addDomListener(window, 'load', initFavMap);
});


