var map;
var markers = [];
function loadMap() {
   var myOptions = {
      center: new google.maps.LatLng(33.646259, -117.842056),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
		
   map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
   var geocoder = new google.maps.Geocoder();
   populate("");
}
	  
function opensend(string) {
   xmlhttp.open("GET", "andb-connect.php", true);
   xmlhttp.send();
}

function test(){ 
   alert("heilsaf");
}
	  
function populate(city) {
   try {
      var xmlhttp;
      if (window.XMLHttpRequest) {
         xmlhttp = new XMLHttpRequest();
      } else {
         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange = function() {
         if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            var xmlDoc = xmlhttp.responseXML;
            deleteMarkers();
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
      }
			  
      if (city == null) city = "%";
      xmlhttp.open("GET", "andb-connect.php", true);
      xmlhttp.send();
			  
   } catch (e) {
      alert("Error: " + e);
   }
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
	  
	  
function deleteMarkers() {
   if (markers) {
      for (i in markers) {
         markers[i].setMap(null);
      }
   }
   markers = [];
}
	  
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
   if (debug) alert("4 Address Coded");
}
	  
function reloadMap() {
   map = null;
   myOptions = null;
   marker = null;
   address = null;
   mapscript = close();
   loadScripts();
}