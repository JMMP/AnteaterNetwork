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
    var infoWindow = new google.maps.InfoWindow;
    
    //var geocoder = new google.maps.Geocoder();
    
    downloadUrl("andb-connect.php", function(data) {});
}

function downloadUrl(url, callback) {
    var request;
    if (window.ActiveXObject) {
        request = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        request = new XMLHttpRequest;
    }

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request, request.status);
        }
    };

    request.open('GET', url, true);
    request.send(null);
}

function doNothing() {}