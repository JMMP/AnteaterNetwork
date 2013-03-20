/*
 * Anteater Network v14.0
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
var markersLatLng = []; // Store positions of all markers for buffering the view bounds
var markerBuffer = 0.0035; // Buffer around markers in all four directions

// Filters
var filters = {
  city: "",
  category: "",
  year: "",
  school: "",
  search: ""
};

// HTML elements accessed by this script
var mapID = "#js-map";
var resultsID = "#js-results";
var resultsListID = "#js-results-list";
var resultsInnerID = "#js-results-inner";
var resultsHideID = "#js-results-hide";
var resultsShowID = "#js-results-show";
var resultsNoneID = "#js-results-none";
var menus = {
  city: "#js-menu-city",
  category: "#js-menu-category",
  year: "#js-menu-year",
  school: "#js-menu-school"
};
var toggleClustersID = ".js-toggle-clusters";
var toggleFiltersID = ".js-toggle-filters";
var filtersID = "#js-filters";
var searchID = "#js-search";
var loadingID = "#js-loading-overlay";
var heightBuffer = 167; // Distance in pixels of height of navbar and footer

$(document).ready(function() {
  // Resize map and results list on load
  updateSize();

  // Hide filters by default
  $(filtersID).hide();

  // Start with filters if user is on a desktop
  if ($(".visible-desktop").is(":visible")) {
    $(toggleFiltersID).bootstrapSwitch("setState", true, true);
    $(filtersID).toggle("slide", function() {
      $(searchID).toggle();
    });
  }

  // Change event handler for toggling filters and search
  $(toggleFiltersID).on("switch-change", function (e, data) {
    if (data.value) {
      $(searchID).toggle();
      $(filtersID).toggle("slide");      
    } else {
      $(filtersID).toggle("slide", function() {
        $(searchID).toggle();
      });
    }    
  });

  // Change event handler for toggling clusters
  $(toggleClustersID).on("switch-change", function (e, data) {
    toggleClusters(data.value);
  });

  // Initialize system
  loadMap();
  populate();

  // Click event handler for hiding results list
  $(resultsHideID).click(function(e) {
    var mapPosition = $(mapID).position();

    // Hold map in place while the results list hides
    $(mapID).css("position", "absolute");
    $(mapID).css("left", mapPosition.left);

    // Hide results list
    $(resultsID).toggle("drop", function() {
      // Show the "Show" button and adjust map after the results list is hidden
      $(resultsShowID).show();
      $(mapID).css("position", "relative");
      $(mapID).css("left", "auto");
      $(mapID).css("margin-left", 0);
      $(mapID).attr("class", "span12");
      gmap.refresh(); // Reload map after it expands
    });
  });

  // Click event handler for showing results list
  $(resultsShowID).click(function(e) {
    // Hide the "Show" button and hold map in place
    $(resultsShowID).hide("drop");
    $(mapID).attr("class", "span9");
    $(mapID).addClass("offset3");
    $(mapID).css("margin-left", "");
    $(mapID).css("position", "absolute");
    $(resultsID).toggle("drop", function() {
      $(mapID).removeClass("offset3");
      $(mapID).css("position", "relative");
    });
    gmap.refresh(); // Reload map after it shrinks
  });

  // Enable Bootstrap tooltips with custom show and hide delays
  $("[rel=tooltip]").tooltip({
    delay: {
      show: 600,
      hide: 200
    }
  });
});

// Resize map and results list when window is resized
$(window).resize(function(){
  updateSize();
  gmap.refresh(); 
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

function updateSize() {
  // Resize map and results list according to height of window
  var distance = heightBuffer;
  $(mapID).height(window.innerHeight - distance);
  if (window.innerWidth <= 767) {
    // If screen resolution is less than 767px wide,
    // show a shorter results list
    distance += 150;
  }
  $(resultsID).css("max-height", window.innerHeight - distance);
  $(resultsListID).css("max-height", window.innerHeight - distance);
  $(resultsInnerID).height(window.innerHeight - distance - 26);
  $(resultsInnerID).css("max-height", window.innerHeight - distance - 26);
}

function loadMap() {
  // Show loading bar and create new GMaps
  $(loadingID).show();
  gmap = new GMaps({
    el: mapID,
    // Focus map on UCI (will be overridden once map has markers)
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

  // Add button for geolocation
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

  // Populate the menus
  getMenu("city");
  getMenu("year");
  getMenu("school");
  getMenu("category");
}

// Populate map, alias for no filters
function populate() {
  populate("", "");
}

// Populate map
function populate(filter, input) {
  // Show loading bar,  store the filter type and value,
  // and clear the results list and the markers on the map
  $(loadingID).show();
  setFilter(filter, input);
  $(resultsInnerID).html("");
  clearMarkers();

  // AJAX call to getAlumni.php to get the appropriate businesses matching the filters
  $.get("getAlumni.php?filters&" + getRequest(), {}, function(data, status) {
    // Create markers with the data that is returned
    var alumni = data.getElementsByTagName("alumnus");
    for (i = 0; i < alumni.length; i++)
      createMarker(alumni[i]);

    // Update view bounds of map and check if there are any results displayed
    setBounds();
    checkResults();

    // Hide loading bar once we are done everything
    $(loadingID).fadeOut();
  });
}

function setFilter(filter, input) {
  if (filters.hasOwnProperty(filter))
    filters[filter] = input;
}

function clearFilters() {
  // Treat clearing all filters as loading the system for the first time
  firstLoad = true;

  // Clear all filters
  for (i in filters)
    filters[i] = "";

  // Clear values in text boxes
  $("input").val("");

  // Re-populate map
  populate();
}

function createMarker(alumni) {
  // Build content for results list
  var sideListing = document.createElement("LI");
  var sideItem = document.createElement("A");
  var sideDetails = document.createElement("SPAN");
  var sideHTML = "";
  var busLat = "";
  var busLng = "";
  var busName = "";
  var id = "";
  var address = "";
  var infoHTML = "<div class='infoWindow-inner'>"; // Info window content

  // Check if the alumni has various attributes. If they do,
  // store them and display them in the info window and results list
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

  // Create HTML for the results list
  sideDetails.innerHTML = sideHTML;
  sideItem.appendChild(sideDetails);  
  sideListing.appendChild(sideItem);
  $(resultsInnerID).append(sideListing);
  
  // Catch businesses with no latitude or longitude
  // Don't show these on the map but still list them in the results box
  if ((busLat !== "" || busLng !== "") && (parseFloat(busLng) !== 0 || parseFloat(busLng) !== 0)) {
    var point = new google.maps.LatLng(parseFloat(busLat), parseFloat(busLng));

    // Buffer for the view bounds of the map
    var pointBufferedNE = new google.maps.LatLng(parseFloat(busLat) + markerBuffer, parseFloat(busLng) + markerBuffer);
    var pointBufferedSW = new google.maps.LatLng(parseFloat(busLat) - markerBuffer, parseFloat(busLng) - markerBuffer);
    markersLatLng.push(pointBufferedNE);
    markersLatLng.push(pointBufferedSW);

    // Add the Get Directions link
    infoHTML += "<a href='http://maps.google.com/maps?daddr=" + address.replace(" ", "+") + "' target ='_blank'>Get Directions</a>";

    // Add marker to map
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
    // and center map
    $(sideListing).click(function() {
      $(resultsInnerID).children("li").removeClass("active");
      $(sideListing).addClass("active");
      gmap.hideInfoWindows();
      marker.infoWindow.open(gmap, marker);
      gmap.setCenter(busLat, busLng);
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
  // Check if there are markers
  if (markersLatLng.length !== 0) {
    // Set bounds to United States if it is the first load or filters were cleared
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
  // Check if there are results being shown
  // We cannot check the markers array because there may
  // be businesses without an address being shown
  if ($(resultsInnerID).html() !== "")
    $(resultsNoneID).hide();    
  else
    $(resultsNoneID).show();
}

function clearMarkers() {
  // Remove markers from map and marker clusterer
  // Also clear our view bounds array
  gmap.removeMarkers();
  mc.clearMarkers();
  markersLatLng = [];
}

function toggleClusters(enable) {
  if (enable) {
    // Set the marker clusterer and add all the markers to the clusterer
    gmap.markerClusterer = mc;
    mc.addMarkers(gmap.markers);
  } else {
    // Remove marker clusterer and clear all markers from the clusterer
    gmap.markerClusterer = null;
    mc.clearMarkers();
    // Show the markers on the map again
    for (i in gmap.markers) {
      gmap.markers[i].setVisible(true);
      gmap.markers[i].setMap(gmap.map);
    }

    // Reset any highlighted listing and close info windows
    $(resultsInnerID).children("li").removeClass();
    gmap.hideInfoWindows();
  }
}

function getRequest() {
  var request = "";

  // If the free search is being used, ignore the other filters
  // Otherwise, build the request normally
  if (filters.search !== "") {
    // Split words up and add necessary operators
    // for MySQL Full-text boolean mode
    // After, format the request for HTML
    var tokens = filters.search.split(" ");
    for (i in tokens) {
      if (i.charAt(0) !== "-")
        request += "+";
      request += tokens[i] + "* ";
    }
    request = "search=" + encodeURIComponent(request);
  } else {
    for (i in filters) {
      if (filters[i] !== "") {
        if (request !== "")
          request += "&";
        request += i + "=" + encodeURIComponent(filters[i]);
      }
    }
  }
  return request;
}

function getMenu(menu) {
  if (filters.hasOwnProperty(menu)) {
    // Populate the filter menus
    // Add change event handler for applying the filter
    $.get("getMenu.php?menu=" + menu, function(data) {
      var element = $(menus[menu]);
      element.html(data);
      element.combobox({
        items: 8,
        minLength: 2
      });
      element.change(function(data) {
        populate(menu, element.val());
      })
    });
  }
}

function geolocate () {
  GMaps.geolocate({
    success: function(position) {
      // If a geolocation marker exists, remove it
      if (markerGeolocate)
        markerGeolocate.setMap(null);

      // Make a new marker with the position from the geolocate function
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