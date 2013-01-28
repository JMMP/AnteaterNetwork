var map;
var markerImage;
var mapStyles;

$(document).ready( function() {
  loadMap();
  populate('', '');
  $('#js-toggle-clusters').on('switch-change', function (e, data) {
    var $el = $(data.el);
    var value = data.value;
    console.log(e, $el, value);
  });
  $( '#js-menu-type > li' ).click( function() {
    $( '#js-menu-type' ).children('li').removeClass();
    $( this ).addClass( 'active' );
  });
});

// Catch enter presses on main page
function enterPressed(e) {
  var keycode;
  if (window.event)
    keycode = window.event.keyCode;
  else if (e)
    keycode = e.which;
  else
    return false;
  return (keycode == 13);
}

function loadMap() {
  markerImage = "images/marker_anteater_small.png";
  mapStyles = [{
    "featureType": "water",
    "stylers": [{
      "lightness": 14
    }]
  }, {
    "featureType": "road",
    "stylers": [{
      "saturation": 100
    }, {
      "weight": 0.3
    }, {
      "hue": "#002bff"
    }]
  }, {
    "featureType": "landscape",
    "stylers": [{
      "hue": "#00ff44"
    }]
  }, {
    "featureType": "poi.school",
    "stylers": [{
      "saturation": 100
    }, {
      "hue": "#ffe500"
    }]
  }];

  map = new GMaps({
    el: "#map_canvas",
    lat: 33.646259,
    lng: -117.842056,
    zoomControl: true,
    zoomControlOpt: {
      style: "LARGE",
      position: "TOP_RIGHT"
    },
    panControl: false,
    scaleControl: false,
    styles: mapStyles
    // markerClusterer: function(map) {
    //   return new MarkerClusterer(map);
    // }
  });
};



var mc;
var markers = [];
var markersLatLng = [];
var xmlhttpMarkers;
var xmlDoc;
var xmlhttpMenus;
var filters = [
["city", ""],
["name", ""],
["zipcode", ""]];
var sidenavID = "js-sidenav";
var pinDrop = false;
var latlngBuffer = 0.003;
var clusters = false;
var infoWindow;
var gc;


function populate(filter, input) {
  setFilter(filter, input);
  sidenav = document.getElementById(sidenavID);
  sidenav.innerHTML = "<li class='nav-header'>Results</li>";
  clearMarkers();
  createXMLHttpRequest(function() {
    //pinDrop = true;
    xmlDoc = xmlhttpMarkers.responseXML;
    var alumni = xmlDoc.getElementsByTagName("alumnus");
    for (i = 0; i < alumni.length; i++) {
      createMarker(alumni[i]);
    }
    if (clusters) {
      clusters = false;
      toggleClusters();
    }
    setBounds();
  });

  xmlhttpMarkers.open("GET", "getAlumni.php" + getRequest(), true);
  xmlhttpMarkers.send();
  getMenu('city');

}


function createXMLHttpRequest(callback) {
  if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari
    xmlhttpMarkers = new XMLHttpRequest();
  } else {
    // IE6, IE5
    xmlhttpMarkers = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttpMarkers.onreadystatechange = function() {
    if (xmlhttpMarkers.readyState == 4 && xmlhttpMarkers.status == 200) {
      callback();
    }
  };
}


function setFilter(filter, input) {
  for (i in filters) {
    if (filters[i][0] == filter)
      filters[i][1] = input;
  }
}


function resetFilter(filter) {
  for (i in filters) {
    if (filters[i][0] == filter)
      filters[i][1] = "";
  }
}


function resetFilters() {
  for (i in filters) {
    filters[i][1] = "";
  }
}


function getRequest() {
  var request = "";
  for (i in filters) {
    if (filters[i][1] != "") {
      if (request != "")
        request += "&";
      request += filters[i][0] + "=" + filters[i][1];
    }
  }
  return "?" + request;
}


function createMarker(alumni) {
  var sideListing = document.createElement("LI");
  var sideItem = document.createElement("A");
  var sideDetails = document.createElement("SPAN");
  var sideHTML = "";
  var busLat = "";
  var busLng = "";
  var busName = "";

  var infoHTML = "<div class='infoWindow'>";

  if (alumni.hasAttribute("Business_Name")) {
    busName = alumni.getAttribute("Business_Name");
    sideItem.innerHTML = busName;
    infoHTML += "<h2 id='firstHeading' class='firstHeading'>" + busName + "</h2>";
  }

  infoHTML += "<div id='bodyContent'>";

  if (alumni.hasAttribute("First_Name") && alumni.hasAttribute("Last_Name")) {
    var firstName = alumni.getAttribute("First_Name");
    var lastName = alumni.getAttribute("Last_Name");
    infoHTML += firstName + " " + lastName  + "<br />";
  }

  if (alumni.hasAttribute("Business_Street1")) {
    var busStreet1 = alumni.getAttribute("Business_Street1");
    sideHTML += busStreet1 + "<br />";
    infoHTML += busStreet1 + "<br />";
  }

  if (alumni.hasAttribute("Business_City") && alumni.hasAttribute("Business_State")) {
    var busCity = alumni.getAttribute("Business_City");
    var busState = alumni.getAttribute("Business_State");
    sideHTML += busCity + ", " + busState;
    infoHTML += busCity + ", " + busState;
  }

  if (alumni.hasAttribute("Business_Zipcode")) {
    var busZipcode = alumni.getAttribute("Business_Zipcode");
    sideHTML += " " + busZipcode;
    infoHTML += " " + busZipcode;
  }

  sideHTML += "<br />";
  infoHTML += "<br />";

  if (alumni.hasAttribute("Business_Phone")) {
    var busPhone = alumni.getAttribute("Business_Phone");
    sideHTML += busPhone;
    infoHTML += busPhone + "<br />";
  }

  if (alumni.hasAttribute("Business_Lat") && alumni.hasAttribute("Business_Lng")) {
    busLat = alumni.getAttribute("Business_Lat");
    busLng = alumni.getAttribute("Business_Lng");
  }

  sideDetails.innerHTML = sideHTML;
  sideItem.appendChild(sideDetails);

  // Generate HTML list for the results list on the side
  sideListing.appendChild(sideItem);
  sidenav.appendChild(sideListing);

  //var point = codeAddress(busStreet1 + ", " + busCity + ", " + busState);  // Geocoding

  // Catch businesses with no latitude or longitude
  // Don't show these on the map but still list them in the results box
  if (busLat != "" || busLng != "") {
    //if (point) {  // Geocoding
      var point = new google.maps.LatLng(parseFloat(busLat), parseFloat(busLng));
    //busLat = point.lat();  // Geocoding
    //busLng = point.lng();  // Geocoding

    var pointBufferedNE = new google.maps.LatLng(parseFloat(busLat) + latlngBuffer, parseFloat(busLng) + latlngBuffer);
    var pointBufferedSW = new google.maps.LatLng(parseFloat(busLat) - latlngBuffer, parseFloat(busLng) - latlngBuffer);

    // Add marker position to array
    markersLatLng.push(pointBufferedNE);
    markersLatLng.push(pointBufferedSW);
    infoHTML += "<a href='http://maps.google.com/maps?daddr=" + point.toUrlValue() + "' target ='_blank'>Get Directions</a>";

    map.addMarker({
      lat: busLat,
      lng: busLng,
      icon: markerImage,
      title: busName,
      infoWindow: {
        content: infoHTML
      }
    });
    return true;
  }
  return false;
}

function busClick(html, marker) {
  return function() {
    if (infoWindow)
      infoWindow.close();
    infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  }
}

function setBounds() {
  if (markers.length == 0) {
    // If there are no markers to show, don't move map and give an alert or error instead
    document.getElementById("js-alert").innerHTML = "<div class='alert alert-error'><h4 class='alert-heading'>No results found!</h4></div>";
    return false;
  } else {
    document.getElementById("js-alert").innerHTML = "";
    //  Create a new viewpoint bound
    var bounds = new google.maps.LatLngBounds();
    // Increase bounds for each marker
    for (i in markersLatLng) {
      bounds.extend(markersLatLng[i]);
    }

    // Fit bounds to the map
    map.fitBounds(bounds);
    return true;
  }
}


function clearMarkers() {
  if (markers) {
    for (i in markers) {
      markers[i].setMap(null);
    }
  }
  markers = [];
  markersLatLng = [];
}


function hideMarkers() {
  for (i in markers) {
    markers[i].setVisible(false);
  }
}


function showMarkers() {
  for (i in markers) {
    markers[i].setVisible(true);
    markers[i].setMap(map);
  }
}


function codeAddress(input) {
  var gcrequest = {
    address: input,
    region: "US"
  };
  gc.geocode(gcrequest, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      return results[0].geometry.location;
    } else {
      alert(input + "\n" + "Geocode was note successful: " + status);
    }
  });
  return false;
}

// Catch enter presses on main page
function enter_pressed(e) {
  var keycode;
  if (window.event)
    keycode = window.event.keyCode;
  else if (e)
    keycode = e.which;
  else
    return false;
  return (keycode == 13);
}

function getMenu(menu) {

  if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari
    xmlhttpMenus = new XMLHttpRequest();
  } else {
    // IE6, IE5
    xmlhttpMenus = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttpMenus.onreadystatechange = function() {

    if (xmlhttpMenus.readyState == 4 && xmlhttpMenus.status == 200) {
      document.getElementById("js-menu-city").innerHTML = xmlhttpMenus.responseText;
      $( '#js-menu-city > li' ).click( function() {
        $( '#js-menu-city' ).children('li').removeClass();
        $( this ).addClass( 'active' );
      });
    }
  };

  xmlhttpMenus.open("GET", "getMenu.php?menu=" + menu, true);
  xmlhttpMenus.send();
}


function toggleClusters() {
  mc.clearMarkers();
  if (clusters) {
    showMarkers();
    clusters = false;
  } else {
    mc.addMarkers(markers);
    clusters = true;
  }
}