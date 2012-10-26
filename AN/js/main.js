// developers.google.com/maps/articles/phpsqlajax_v3

var map;
var markers = [];
    
function loadMap() {
    var myOptions = {
        center: new google.maps.LatLng(33.646259, -117.842056),
        zoom: 10,
        mapTypeId: 'roadmap'
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    populateMap();
}

function populateMap() {
    var request;
    if (window.ActiveXObject) {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        request = new XMLHttpRequest;
    }

    request.onreadystatechange = function() {        
        if (request.readyState == 4 && request.status==200) {
            var xmlDoc = request.responseXML;
            var alumni = xmlDoc.getElementsByTagName("alumnus");
            for (var i = 0; i < alumni.length; i++) {
                var first_name = alumni[i].getAttribute("First_Name");
                var last_name = alumni[i].getAttribute("Last_Name");
                var bus_name = alumni[i].getAttribute("Business_Name");
                var bus_lat = alumni[i].getAttribute("Business_Lat");
                var bus_lng = alumni[i].getAttribute("Business_Lng");
                createMarker(first_name, last_name, bus_name, bus_lat, bus_lng);
            }
        }
    };

    request.open("GET", "andb-connect.php", true);
    request.send();
}

function createMarker(first_name, last_name, bus_name, bus_lat, bus_lng) {
    var point = new google.maps.LatLng(parseFloat(bus_lat), parseFloat(bus_lng));
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.Drop,
        position: point,
        title: bus_name
    });
		  
    var contentString = '<div id="content">' + '<h2 id="firstHeading" class="firstHeading">' + bus_name + '</h2>' + '<div id="bodyContent">' + '<p>' + first_name + ' ' + last_name;
		  
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
		  
    if (infowindow) infowindow.close();
    google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker);
    });
    markers.push(marker);
}