var map;
var markers = [];
var xmlDoc;
var filters = [
["city", ""],
["name", ""],
["zipcode", ""]];
var infowindow;

// Style Google Maps
var markerImage = "images/marker_anteater_small.png";

// https://developers.google.com/maps/documentation/javascript/styling
var stylesArray = [{
   "featureType": "poi.school",
   "stylers": [{
      "hue": "#eeff00"
   },{
      "saturation": 56
   }]
},{
   "stylers": [{
      "lightness": -21
   }]
},{
   "featureType": "road",
   "stylers": [{
      "hue": "#0000ff"
   },{
      "weight": 0.4
   }]
}];

function loadMap() {
   var myOptions = {
      center: new google.maps.LatLng(33.646259, -117.842056),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: stylesArray
   };
		
   map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
   var geocoder = new google.maps.Geocoder();
   
}

	  
function populate(filter, input) {
   var xmlhttp;
   var i;
   if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
   } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
         xmlDoc = xmlhttp.responseXML;
         clearMarkers();
         var alumni = xmlDoc.getElementsByTagName("alumnus");
         for (i = 0; i < alumni.length; i++) {
            
            createMarker(alumni[i]);
         }
      }
   }
   
   for (i = 0; i < filters.length; i++) {
      if (filters[i][0] == filter)
         filters[i][1] = input;
   }
   
   var request = ""; 
   for (i = 0; i < filters.length; i++) {
      if (filters[i][1] != "") {
         if (request != "")
            request += "&";
         request += filters[i][0] + "=" + filters[i][1];
      }
   }
   
   xmlhttp.open("GET", "andb-connect.php?" + request, true);
   xmlhttp.send();
}

   
function createMarker(alumni) {
   var first_name = alumni.getAttribute("First_Name");
   var last_name = alumni.getAttribute("Last_Name");
   var class_year = alumni.getAttribute("Class_Year");
   var school_code = alumni.getAttribute("School_Code");
   var bus_title = alumni.getAttribute("Business_Title");
   var bus_name = alumni.getAttribute("Business_Name");
   var bus_street1 = alumni.getAttribute("Business_Street1");
   var bus_street2 = alumni.getAttribute("Business_Street2");
   var bus_city = alumni.getAttribute("Business_City");
   var bus_state = alumni.getAttribute("Business_State");
   var bus_zipcode = alumni.getAttribute("Business_Zipcode");
   var bus_phone = alumni.getAttribute("Business_Phone");
   var bus_lat = alumni.getAttribute("Business_Lat");
   var bus_lng = alumni.getAttribute("Business_Lng");
   
   var point = new google.maps.LatLng(parseFloat(bus_lat), parseFloat(bus_lng));
   var marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: point,
      icon: markerImage,
      title: bus_name
   });
		  
   var contentString = "<div id='infoWindow'>" + 
   "<h2 id='firstHeading' class='firstHeading'>" + bus_name + "</h2>" + 
   "<div id='bodyContent'>" + "" + first_name + " " + last_name + 
   " (" + school_code + ", " + class_year + ")<br />" + bus_title + "<br />" + bus_name + "<br />" + 
   bus_street1 + "<br />" + bus_city + ", " + bus_state + " " + bus_zipcode + 
   "<br />" + bus_phone + "<br />";
		  
   
   google.maps.event.addListener(marker, "click", function() {
      if (infowindow) infowindow.close();
      infowindow = new google.maps.InfoWindow({
         content: contentString
      });
      infowindow.open(map, marker);
   });
   
   markers.push(marker);
}
	  
	  
function clearMarkers() {
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
}
	  
function reloadMap() {
   map = null;
   markers = null;
   request = "";
   loadScripts();
}