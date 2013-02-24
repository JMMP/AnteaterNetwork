/*
 * Anteater Network v13.2
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

// Map and custom styling
var firstLoad = true; // true on initial load AND when all filters are cleared
var gmap;
var mapStyles = [{
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

// Marker clusterer and custom marker icons
var mc;
var markerImage = "images/marker_anteater.png";
var markerGeolocateImage = "images/marker_person.png";
var markerGeolocate; // Geolocation marker
var markersLatLng = [];
var markerBuffer = 0.0035; // buffer around markers in all four directions

// Filters
var filters = [["city", ""], ["name", ""], ["year", ""], ["school", ""], ["category", ""], ["search", ""]];

// HTML elements accessed by this script
var mapID = "#js-map";
var resultsID = "#js-results";
var resultsInnerID = "#js-results-inner";
var resultsHideID = "#js-results-hide";
var resultsShowID = "#js-results-show";
var menuCityID = "#js-menu-city";
var menuCategoryID = "#js-menu-category";
var menuYearID = "#js-menu-year";
var menuSchoolID = "#js-menu-school";
var noresultsID = "#js-noresults";
var toggleClustersID = "#js-toggle-clusters";
var loadingID = "#js-loading-overlay";

$(document).ready(function() {
  loadMap();
  populate();

  // Catch changes to the clusters switch
  // Toggle clusters depending on the state of the switch
  $(toggleClustersID).on("switch-change", function (e, data) {
    toggleClusters(data.value);
  });

  // Enable Bootstrap tooltips with custom show and hide delays
  $("[rel=tooltip]").tooltip({
    delay: {
      show: 600,
      hide: 200
    }
  });

  // Enable Select2 inputs
  $("#js-input-name2").select2({
    multiple: true,
    placeholder: "Search by state",
    tokenSeperators: [",", " "]
  });

  $(resultsHideID).click(function(e) {
    var mapPosition = $(mapID).position();
    $(mapID).css("position", "absolute");
    $(mapID).css("left", mapPosition.left);
    $(resultsID).toggle("drop", function() {
      $(resultsShowID).show();
      $(mapID).css("position", "relative");
      $(mapID).css("left", "auto");
      $(mapID).css("margin-left", 0);
      $(mapID).attr("class", "span12");
      gmap.refresh();
    });
  });

  $(resultsShowID).click(function(e) {
    $(resultsShowID).hide("drop");
    $(mapID).attr("class", "span9");
    $(mapID).addClass("offset3");
    $(mapID).css("margin-left", "");
    $(mapID).css("position", "absolute");
    $(resultsID).toggle("drop", function() {
      $(mapID).removeClass("offset3");
      $(mapID).css("position", "relative");
    });
    gmap.refresh();
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
  $(loadingID).show();
  gmap = new GMaps({
    el: mapID,
    lat: 33.646259,
    lng: -117.842056,
    zoomControl: true,
    zoomControlOpt: {
      style: "LARGE",
      position: "TOP_RIGHT"
    },
    panControl: false,
    scaleControl: false,
    styles: mapStyles,
    markerClusterer: function(map) {
      return mc = new MarkerClusterer(map);
    }
  });

  gmap.addControl({
    position: "top_right",
    content: "My Position",
    style : {
      margin: '5px',
      padding: '1px 6px',
      border: 'solid 1px #717B87',
      background: '#fff'
    },
    events: {
      click: function(){geolocate();}
    }
  });

  getMenu("city");
  getMenu("year");
  getMenu("school");
  getMenu("category");
}

function populate() {
  populate("", "");
}

function populate(filter, input) {
  $(loadingID).show();
  setFilter(filter, input);
  $(resultsInnerID).html("");
  clearMarkers();

  $.get("getAlumni.php?filters&" + getRequest(), {}, function(data, status) {
    var alumni = data.getElementsByTagName("alumnus");
    for (i = 0; i < alumni.length; i++)
      createMarker(alumni[i]);
    setBounds();
    checkResults();
    $(loadingID).fadeOut();
  });
}

function setFilter(filter, input) {
  for (i in filters) {
    if (filters[i][0] == filter)
      filters[i][1] = input;
  }
}

function clearFilters() {
  firstLoad = true;
  for (i in filters)
    filters[i][1] = "";
  $("[id^='js-menu-']").children("li").removeClass();
  $("[id^='js-input-'], textarea").val("");
  populate();
}

function createMarker(alumni) {
  var sideListing = document.createElement("LI");
  var sideItem = document.createElement("A");
  var sideDetails = document.createElement("SPAN");
  var sideHTML = "";
  var busLat = "";
  var busLng = "";
  var busName = "";
  var id = "";

  var infoHTML = "<div class='infoWindow-inner'>";
  var address = "";

  if (alumni.hasAttribute("ID_Number"))
    id = alumni.getAttribute("Business_Name");

  if (alumni.hasAttribute("Business_Name")) {
    busName = alumni.getAttribute("Business_Name");
    // Do not show business if it does not have a name
    if (busName === "" || busName === " " || busName === "***")
      return false;
    else
      address += busName + ", ";
    sideItem.innerHTML = "<strong>" + busName + "</strong><br />";
    infoHTML += "<h2 class='infoWindow-heading'>" + busName + "</h2>";
  }

  infoHTML += "<div class='infoWindow-body'>";

  if (alumni.hasAttribute("First_Name") && alumni.hasAttribute("Last_Name")) {
    var firstName = alumni.getAttribute("First_Name");
    var lastName = alumni.getAttribute("Last_Name");
    infoHTML += firstName + " " + lastName;
    if (alumni.hasAttribute("Class_Year")) {
      var year = alumni.getAttribute("Class_Year");
      infoHTML += ", " + year;
      if (alumni.hasAttribute("School_Code")) {
        var school = alumni.getAttribute("School_Code");
        infoHTML += " " + school;
      }
    }
    infoHTML += "<br />";
  }

  if (alumni.hasAttribute("Business_Street1")) {
    var busStreet1 = alumni.getAttribute("Business_Street1");
    sideHTML += busStreet1 + "<br />";
    infoHTML += busStreet1 + "<br />";
    address += busStreet1 + ", ";
  }

  if (alumni.hasAttribute("Business_City") && alumni.hasAttribute("Business_State")) {
    var busCity = alumni.getAttribute("Business_City");
    var busState = alumni.getAttribute("Business_State");
    sideHTML += busCity + ", " + busState;
    infoHTML += busCity + ", " + busState;
    address += busCity + ", " + busState;
  }

  if (alumni.hasAttribute("Business_Zipcode")) {
    var busZipcode = alumni.getAttribute("Business_Zipcode");
    sideHTML += " " + busZipcode;
    infoHTML += " " + busZipcode;
    address += ", " + busZipcode;
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
  $(resultsInnerID).append(sideListing);
  
  // Catch businesses with no latitude or longitude
  // Don't show these on the map but still list them in the results box
  if ((busLat !== "" || busLng !== "") && (parseFloat(busLng) !== 0 || parseFloat(busLng) !== 0)) {
    var point = new google.maps.LatLng(parseFloat(busLat), parseFloat(busLng));

    var pointBufferedNE = new google.maps.LatLng(parseFloat(busLat) + markerBuffer, parseFloat(busLng) + markerBuffer);
    var pointBufferedSW = new google.maps.LatLng(parseFloat(busLat) - markerBuffer, parseFloat(busLng) - markerBuffer);

    // Add marker position to array
    markersLatLng.push(pointBufferedNE);
    markersLatLng.push(pointBufferedSW);
    infoHTML += "<a href='http://maps.google.com/maps?daddr=" + address.replace(" ", "+") + "' target ='_blank'>Get Directions</a>";

    var marker = gmap.addMarker({
      lat: busLat,
      lng: busLng,
      icon: markerImage,
      title: busName,
      infoWindow: {
        content: infoHTML
      }
    });

    // Open info window when listing is clicked and highlight it
    $(sideListing).click(function() {
      $(resultsInnerID).children("li").removeClass("active");
      $(sideListing).addClass("active");
      gmap.hideInfoWindows();
      marker.infoWindow.open(gmap, marker);
    });

    // Highlight listing when marker is clicked
    google.maps.event.addListener(marker, 'click', function() {
      $(resultsInnerID).children("li").removeClass("active");
      $(sideListing).addClass("active");
    });

    return marker;
  }
  return false;
}

function setBounds() {
  if (markersLatLng.length !== 0) {
    // Set bounds to United States on first load
    if (firstLoad) {
      var firstLoadBoundNE = new google.maps.LatLng(45.460131, -71.367188);
      var firstLoadBoundSW = new google.maps.LatLng(33.137551, -124.628906);
      markersLatLng = [];
      markersLatLng.push(firstLoadBoundNE);
      markersLatLng.push(firstLoadBoundSW);
      firstLoad = false;
    }
    gmap.fitLatLngBounds(markersLatLng);
    return true;
  }
  return false;
}

function checkResults() {
  if ($(resultsInnerID).html !== "")
    $(noresultsID).hide();    
  else
    $(noresultsID).show();
}

function clearMarkers() {
  gmap.removeMarkers();
  mc.clearMarkers();
  markersLatLng = [];
}

function toggleClusters(enable) {
  if (enable) {
    gmap.markerClusterer = mc;
    mc.addMarkers(gmap.markers);
  } else {
    gmap.markerClusterer = null;
    mc.clearMarkers();    
    for (i in gmap.markers) {
      gmap.markers[i].setVisible(true);
      gmap.markers[i].setMap(gmap.map);
    }
    $(resultsInnerID).children("li").removeClass();
    gmap.hideInfoWindows();
  }
}

function getRequest() {
  var request = "";
  if (filters[5][1] !== "") {
    var tokens = filters[5][1].split(" ");
    for (i in tokens) {
      if (i.charAt(0) === "-")
        request += "-";
      else
        request += "+";
      request += tokens[i] + "* ";
    }
    request = filters[5][0] + "=" + encodeURIComponent(request);
  } else {
    for (i in filters) {
      if (filters[i][1] !== "") {
        if (request !== "")
          request += "&";
        request += filters[i][0] + "=" + filters[i][1];
      }
    }
  }
  return request;
}


function getMenu(menu) {
  $.get("getMenu.php?menu=" + menu, {}, function(data, status) {
    if (menu == "city") {
      $(menuCityID).html(data);
      $(menuCityID).prepend("<li class=\"active\"><a onclick=\"populate('city', '')\">All</a></li><li class=\"divider\"></li>");
      $(menuCityID).children("li").click( function() {
        $(menuCityID).children("li").removeClass("active");
        $(this).addClass("active");
      });
    } else if (menu == "year") {
      $(menuYearID).html(data);
      $(menuYearID).prepend("<li class=\"active\"><a onclick=\"populate('year', '')\">All</a></li><li class=\"divider\"></li>");
      $(menuYearID).children("li").click( function() {
        $(menuYearID).children("li").removeClass("active");
        $(this).addClass("active");
      });
    } else if (menu == "school") {
      $(menuSchoolID).html(data);
      $(menuSchoolID).prepend("<li class=\"active\"><a onclick=\"populate('school', '')\">All</a></li><li class=\"divider\"></li>");
      $(menuSchoolID).children("li").click( function() {
        $(menuSchoolID).children("li").removeClass("active");
        $(this).addClass("active");
      });
    } else if (menu == "category") {
      $(menuCategoryID).html(data);
      $(menuCategoryID).prepend("<li class=\"active\"><a onclick=\"populate('category', '')\">All</a></li><li class=\"divider\"></li>");
      $(menuCategoryID).children("li").click( function() {
        $(menuCategoryID).children("li").removeClass("active");
        $(this).addClass("active");
      });
    }
  });
}

function geolocate () {
  GMaps.geolocate({
    success: function(position) {
      if (markerGeolocate)
        markerGeolocate.setMap(null);
      markerGeolocate = gmap.createMarker({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        icon: markerGeolocateImage,
        title: "Your Position",
        infoWindow: {
          content: "<h2>Your Position</h2>"
        }
      });
      markerGeolocate.setMap(gmap.map);
      gmap.setCenter(position.coords.latitude, position.coords.longitude);
    },
    error: function(error) {
      alert("Your location could not be detected. (" + error.message + ")");
    },
    not_supported: function() {
      alert("Your browser does not support retrieving your location.");
    }
  });

}