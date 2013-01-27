$(document).ready( function() {
  
});

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
    var $el = $(data.el), value = data.value;
    console.log(e, $el, value);
});