// http://qunitjs.com/cookbook/
// http://msdn.microsoft.com/en-us/library/hh404088.aspx
// http://benalman.com/talks/unit-testing-qunit.html
// 
// Arrange - set up test
// Act - action to be tested
// Assert - evaluation of results
//


// 

function appendDivs() {
  var $fixture = $("#qunit-fixture");
  $fixture.append("<div id='map_canvas'></div>");
  $fixture.append("<div id='sidenav'><div id='submenu_city'></div></div>");
  $fixture.append("<div id='timetaken'></div>");
}

module("Google", {
  setup: function() {
    appendDivs();
    loadMap("map_canvas", "sidenav");
    ok(true, "Setup");
  }
});

test("Load Google Maps API", function() {
  expect(3);

  // If the API was not loaded, this would return errors
  strictEqual(typeof google, "object", "google is an object");
  strictEqual(typeof google.maps, "object", "google.maps is an object");
});

test("Load Google Maps object", function() {
  expect(2);

  // Tell QUnit to wait
  stop();
  google.maps.event.addListenerOnce(map, "tilesloaded", function() {
    ok(true, "Maps loaded");
    start();
  });
});

