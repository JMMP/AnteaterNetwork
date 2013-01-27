var map;

$(document).ready( function() {
  loadMap();
});

function loadMap() {
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
    // markerClusterer: function(map) {
    //   return new MarkerClusterer(map);
    // }
  });
};


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

$('#js-toggle-clusters').on('switch-change', function (e, data) {
    var $el = $(data.el);
    var value = data.value;
    console.log(e, $el, value);
});