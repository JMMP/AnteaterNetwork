var map;
var markerImage;
var mapStyles;

$(document).ready( function() {
  loadMap();

  $('#js-toggle-clusters').on('switch-change', function (e, data) {
    var $el = $(data.el);
    var value = data.value;
    console.log(e, $el, value);
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