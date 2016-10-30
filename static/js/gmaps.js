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
function getFavoriteSpots() {
  var userId = $('#logout-link').data('userid');
  if (userId !== undefined) {
    var userData = {
      'user_id': userId
    };
    $.get('/favorited', userData, makeMarkers);
  }
} // TODO create function to add markers, and show button to save as favorite

function makeMarkers(response) {
  var favBounds = new google.maps.LatLngBounds();
  // response is gonna look like this!
  // {'fav_spots': [{'spot_address': blah, 'regulation': blah, 'days': blah, 'hours': blah, 'hrlimit': blah}]}
  // if the list is empty
  if (response['fav_spots'].length === 0) {
    alert('You currently have no favorite spots. Go favorite some!');
  } else {
    var favLatLng,
    favMark;
    for (var i = 0; i < response['fav_spots'].length; i++) {
      // unpacking response data
      favLatLng = response['fav_spots'][i]['spot_address'].replace('{lat: ', '').replace('lng: ', '').replace('}', '');
      favLatLng = favLatLng.split(', ');
      regulationType = response['fav_spots'][i]['regulation'] || 'N/A';
      regulatedDays = response['fav_spots'][i]['days'] || 'N/A';
      regulatedHours = response['fav_spots'][i]['hours'] || 'N/A';
      regulatedHrLimit = response['fav_spots'][i]['hrlimit'] || 'N/A';
      // if (regulationType === '' || regulatedDays === '' || regulatedHours === '' || regulatedHrLimit === '') {
      // }
      // TODO: Better design choice. Go back and store the lat lngs as numbers in the db.
      favMark = new google.maps.Marker({
        map: favMap,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(favLatLng[0], favLatLng[1]),
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'
      });
      var html = '<div class="content">' +
      '<button type="button" onclick="deleteFavoriteSpot(' +
      '\'{lat: ' + favLatLng[0] + ', lng: ' + favLatLng[1] + '}\')" class="btn btn-primary" id="fav-button">' +
      'Unfavorite</button>' +
      '<button type="button" onclick="getDirections(' + favLatLng[0] + ',' + favLatLng[1] + ')" class="btn btn-primary" id="directions-button">Get Directions to Here</button>' +
      '<button type="button" onclick="textDirections(' + favLatLng[0] + ',' + favLatLng[1] + ')" class="btn btn-primary" id="text-directions-button">Text Directions to Me</button>' +
      '<br><h3>Parking Details</h3>' +
      '<h4>Regulation Type:</h4> ' + regulationType +
      '<br><h4>Regulated Days:</h4> ' + regulatedDays +
      '<br><h4>Regulated Hours:</h4> ' + regulatedHours +
      '<br><h4>Regulated Hour Limit:</h4> ' + regulatedHrLimit +
      '</div>';
      // javascript closure
      // params here
      google.maps.event.addListener(favMark, 'click', (function (favMark, html, infoWindow) {
        return function () {
          infoWindow.close();
          infoWindow.setContent(html);
          infoWindow.open(favMap, favMark);
        };
        // what you actually pass in
      }) (favMark, html, infoWindow));
      var boundingFavMark = new google.maps.LatLng(favLatLng[0], favLatLng[1]);
      favBounds.extend(boundingFavMark);
    } //end for loop

    favMap.fitBounds(favBounds);
  } // end else

} // end function

function deleteFavoriteSpot(spotAddress) {
  var userId = $('#logout-link').data('userid');
  if (userId !== undefined) {
    var delData = {
      'user_id': userId,
      'spot_address': spotAddress
    };
    $.post('/unfavorited', delData, function () {
      alert('That spot has been deleted.');
      // reload page so markers are fresh
      location.reload();
    });
  }
}
function addInfoWindowFavoritePlaces(lat, long, Mark) {
  // var fav_html = '<div class="content">' +
  // '<button type="button" onclick="createFavoriteSpot(' + lat +
  // ', \'{lat: ' + lat + ', lng: ' + long + '}\')" class="btn btn-primary" id="fav-button">' +
  // 'Favorite</button>' +
  // '</div>';
  var fav_html = '<div class="content">' +
  '<h1>Teste</h1>' +
  '</div>';
  // javascript closure
  // params here
  // Local InfoWindow
  var local_infowindow = new google.maps.InfoWindow({
    content: fav_html
  });
  google.maps.event.addListener(Mark, 'click', (function (Mark, fav_html, local_infowindow) {
    return function () {
      infoWindow.close();
      infoWindow.setContent(fav_html);
      infoWindow.open(favMap, Mark);
    };
    // what you actually pass in
  }) (Mark, fav_html, local_infowindow));
  // Diplay current waiting time in colour
}; // End of addInfoWindowFavoritePlaces
// this gets called when you click the fav-button rendered in InfoWindow
function createFavoriteSpot(regId, parkLatLng) {
  // TO DO: break up the params in html as regId, parkLat, parkLng
  // and then here grab it and reconstruct it into the format wanted before
  // passing to server
  // grabbing user id from html that only shows if user is in session
  var userId = $('#logout-link').data('userid');
  if (userId !== undefined) {
    var markerData = {
      'reg_id': regId,
      'user_id': userId,
      'spot_address': parkLatLng
    };
    $.post('/favorited', markerData, function () {
      alert('Your marker has been favorited.');
      // TO DO: Turn marker a different color
    });
  } else {
    alert('You need to be logged in to favorite spots.');
  }
}
function locateUser() {
  var browserSupportFlag = new Boolean();
  if (navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function (position) {
      //var pos = {
      //  lat: position.coords.latitude,
      //  lng: position.coords.longitude
      //};
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      //debugger();
      //infoWindow.setPosition(pos);
      //infoWindow.setContent('Location found.');
      //favMap.setCenter(pos);
      favMark = new google.maps.Marker({
        map: favMap,
        position: new google.maps.LatLng(lat, long),
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png'
      });
      addInfoWindowFavoritePlaces(position.coords.latitude, position.coords.longitude, favMark);
      window.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // anything that needs to ref userLocation MUST happen before the end of this function
    }, function () {
      handleNoGeolocation(browserSupportFlag);
    });
  } // end if
  // browser doesn't support Geolocation so call the handleNoGeolocation fn
   else {
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
