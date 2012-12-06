<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <title>JMMP Architectural Prototype</title>
        <style type="text/css">
            html { height: 100% }
            body { height: 100%; margin: 20px; padding: 0px }
            #map_canvas { height: 100% }
        </style>

        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDjfKwuT7W5o7YSTt6wHmeDaEhgIxuOUoI&sensor=true"></script>

        <script type="text/javascript">
            var map;
            var markers = [];
            var debug = false;
            function initialize() {
                var myOptions = {
                    center: new google.maps.LatLng(33.646259, -117.842056),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
		
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
                var geocoder = new google.maps.Geocoder();
                populate("");
                if (debug) alert("1 Initialized");
            }
	  
            function opensend(string) {
                xmlhttp.open("GET", "ANGetXML.php?Business_City=" + string + "%", true);
                xmlhttp.send();
            }
	  
            function populate(city) {
                try {
                    var xmlhttp;
                    if (window.XMLHttpRequest) {
                        xmlhttp = new XMLHttpRequest();
                    } else {
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    if (debug) alert("A XMLHttpRequest");
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                            var xmlDoc = xmlhttp.responseXML;
                            if (debug) alert("B Creating Markers"); 
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
                    xmlhttp.open("GET", "ANGetXML.php?Business_City=" + city, true);
                    xmlhttp.send();
			  
			  
                    /*
                          var names = xmlDoc.getElementsByTagName("name");
                          var latitudes = xmlDoc.getElementsByTagName("latitude");
                          var longitudes = xmlDoc.getElementsByTagName("longitude");
                              var descriptions = xmlDoc.getElementsByTagName("description");
                              var websites = xmlDoc.getElementsByTagName("website");
                              if (debug) alert("C Reading XML\nD Length: " + names.length);
                          for (var i = 0; i < names.length; i++) {
                                      var name = names[i].childNodes[0].nodeValue;
                                      var lat = latitudes[i].childNodes[0].nodeValue;
                                      var lng = longitudes[i].childNodes[0].nodeValue;
                                      var desc = descriptions[i].childNodes[0].nodeValue;
                                      var site = websites[i].childNodes[0].nodeValue;
                                      createMarker(name, lat, lng, desc, site);				  
                                      if (debug) alert("3 Marker " + i + " Created");
                              }
                     */
			  
			  
                } catch (e) {if (debug) alert("D Error\n" + e);}
                if (debug) alert("2 Populated");
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
	  
            /*
              function createMarker(name, lat, lng, desc, site) {
                      if (debug) alert("F Name: " + name + "\nF Latitude: " + lat + "\nF Longitude: " + lng);
                      var marker = new google.maps.Marker({
                              map: map,
                              animation: google.maps.Animation.Drop,
                              position: new google.maps.LatLng(parseFloat(lat), parseFloat(lng)),
                              title: name
                      });
		  
                      var contentString = '<div id="content">' + '<h2 id="firstHeading" class="firstHeading">' + name + '</h2>' + '<div id="bodyContent">' + '<p>' + desc + '</p><p><a href=' + site + ' target="_blank">Website</a></div>';
		  
                      var infowindow = new google.maps.InfoWindow({
                              content: contentString
                      });
		  
                      if (infowindow) infowindow.close();
                      google.maps.event.addListener(marker, "click", function() {
                              infowindow.open(map, marker);
                      });
              }
             */
	  
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
                alert("5 Map Reloaded");
            }
        </script>
    </head>

    <body onload="initialize()">
        <div id="map_canvas" style="width:100%; height:80%"></div>
        <noscript><b>JavaScript must be enabled to the Anteater Network.</b> 
        </noscript>
        <br />
        <div>
            <input type="button" value="Refresh Map" onclick="location.reload(true)">
            <input type="button" value="MySQL to XML" onclick="parent.location='ANGetXML.php'">      
        </div>

        <div id="filterCity" style="background-color:#aaaaaa;height:40px;width:200px:float:left;">
            <form>
                <select name="Business_City" onchange="populate(this.value)">
                    <option value="">Cities</option>
                    <option value="Orange">Orange</option>
                    <option value="hello">Santa Ana</option>
                    <option value="Newport Beach">Newport Beach</option>
                    <option value="Costa Mesa">Costa Mesa</option>
                    <option value="Irvine">Irvine</option>
                </select>
            </form>
        </div>
        <div id="filterTitle" style="background-color:#aaaaaa;height:40px;width:200px:float:left;">
            <form method="get" action="">
                <input type="text" name="Business_Title" value="Search by Name" onfocus="if(this.value==this.defaultValue) this.value='';" onkeyup="populate(this.value)">
            </form>
        </div>

    </body>
</html>