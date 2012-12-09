var map;
var mc;
var markers = [];
var markersLatLng = [];
var xmlhttp;
var xmlDoc;
var filters = [
["city", ""],
["name", ""],
["zipcode", ""]];
var infowindow;
var sideboxhtml = "";
var pinDrop = false;
var latlngBuffer = 0.003;
var clusters = false;


// Custom marker image
var markerImage = "images/marker_anteater_small.png";

// Style Google Maps
// https://developers.google.com/maps/documentation/javascript/styling
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


function loadMap(divID) {
    var myOptions = {
        center: new google.maps.LatLng(33.646259, -117.842056),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyles,

        panControl: true,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT
        }

    };

    map = new google.maps.Map(document.getElementById(divID), myOptions);
    mc = new MarkerClusterer(map);
//var geocoder = new google.maps.Geocoder();

}


function populate(filter, input) {
    setFilter(filter, input);
    createXMLHttpRequest(function() {
        updatePinDrop(filter);
        xmlDoc = xmlhttp.responseXML;
        clearMarkers();
        sideboxhtml = "";
        var alumni = parseXML(xmlDoc);
        for (i in alumni) {
            createMarker(alumni[i]);
        }
    });

    setBounds();    
    sendXMLHttpRequest("getAlumni.php" + getRequest(), true);
}


function sendXMLHttpRequest(request, asynchronous) {
    xmlhttp.open("GET", request, asynchronous);
    xmlhttp.send();
}


function createXMLHttpRequest(callback) {
    if (window.XMLHttpRequest) {
        // IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback();
        }
    };
}


function updatePinDrop(filter) {
    // Set drop animation if there is no filter
    // This occurs on first load and on filter reset
    if (filter == "")
        pinDrop = true;
    else
        pinDrop = false;
}


function parseXML(xml) {
    return xml.getElementsByTagName("alumnus");
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
    
    sideboxhtml += "<li> <a>";
    var bus_lat = "";
    var bus_lng = "";
    var bus_name = "";
    
    var contentString = "<div id='infoWindow'>";
    
    if (alumni.hasAttribute("Business_Name")) {
        bus_name = alumni.getAttribute("Business_Name");
        sideboxhtml += bus_name + "<br/>";
        contentString += "<h2 id='firstHeading' class='firstHeading'>" + bus_name + "</h2>";
    }
    
    contentString += "<div id='bodyContent'>";
    
    if (alumni.hasAttribute("First_Name") && alumni.hasAttribute("Last_Name")) {
        var first_name = alumni.getAttribute("First_Name");
        var last_name = alumni.getAttribute("Last_Name");
        contentString += first_name + " " + last_name  + "<br />";
    }
    
    if (alumni.hasAttribute("Business_Street1")) {
        var bus_street1 = alumni.getAttribute("Business_Street1");
        sideboxhtml += bus_street1 + "<br />";
        contentString += bus_street1 + "<br />";
    }
    
    if (alumni.hasAttribute("Business_City") && alumni.hasAttribute("Business_State")) {
        var bus_city = alumni.getAttribute("Business_City");
        var bus_state = alumni.getAttribute("Business_State");
        sideboxhtml += bus_city + ", " + bus_state;
        contentString += bus_city + ", " + bus_state;
    }
    
    if (alumni.hasAttribute("Business_Zipcode")) {
        var bus_zipcode = alumni.getAttribute("Business_Zipcode");
        sideboxhtml += " " + bus_zipcode;
        contentString += " " + bus_zipcode;
    }
    
    sideboxhtml += "<br />";
    contentString += "<br />";
    
    if (alumni.hasAttribute("Business_Phone")) {
        var bus_phone = alumni.getAttribute("Business_Phone");
        sideboxhtml += bus_phone;
        contentString += bus_phone + "<br />";
    }
    
    if (alumni.hasAttribute("Business_Lat") && alumni.hasAttribute("Business_Lng")) {
        bus_lat = alumni.getAttribute("Business_Lat");
        bus_lng = alumni.getAttribute("Business_Lng");
    }
    
    sideboxhtml += "</span></a></li>";
    
    //var class_year = alumni.getAttribute("Class_Year");
    //var school_code = alumni.getAttribute("School_Code");

    // Generate HTML list for the results list on the side
    var sidebox = document.getElementById("sidenav");
    sidebox.innerHTML = sideboxhtml;

    // Catch businesses with no latitude or longitude
    // Don't show these on the map but still list them in the results box
    if (bus_lat != "" || bus_lng != "") {
        var point = new google.maps.LatLng(parseFloat(bus_lat), parseFloat(bus_lng));
        var pointBufferedNE = new google.maps.LatLng(parseFloat(bus_lat) + latlngBuffer, parseFloat(bus_lng) + latlngBuffer);
        var pointBufferedSW = new google.maps.LatLng(parseFloat(bus_lat) - latlngBuffer, parseFloat(bus_lng) - latlngBuffer);
        
        // Add marker position to array
        markersLatLng.push(pointBufferedNE);
        markersLatLng.push(pointBufferedSW);

        var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: markerImage,
            title: bus_name
        });

        // Do not have any animation when filtering
        if (pinDrop)
            marker.setAnimation(google.maps.Animation.DROP);
        else
            marker.setAnimation();
        
        contentString += "<a href='http://maps.google.com/maps?daddr=" + point.toUrlValue() + "' target ='_blank'>Get Directions</a>";

        google.maps.event.addListener(marker, "click", function() {
            if (infowindow) infowindow.close();
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            infowindow.open(map, marker);
        });

        markers.push(marker);
        return(marker);
    }
    return false;
}


function setBounds() {
    if (markers.length == 0) {
        // If there are no markers to show, don't move map and give an alert or error instead
        document.getElementById("infobox").innerHTML = "No markers to display!";
        return false;    
    } else {
        document.getElementById("infobox").innerHTML = "";
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


// Incomplete
function codeAddress() {
    var address;
    geocoder.geocode(address, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geomtery.location
            });
        } else {
            if (debug) alert("Geocode was note successful: " + status);
        }
    });
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
    createXMLHttpRequest(function() {
        document.getElementById("submenu_city").innerHTML = xmlhttp.responseText;
    });

    sendXMLHttpRequest("getMenu.php?menu=" + menu, false);
}


function toggleClusters() {
    if (clusters) {
        showMarkers();
        mc.clearMarkers();
        clusters = false;
    } else {
        mc.addMarkers(markers);
        hideMarkers();
        clusters = true;
    }   
}