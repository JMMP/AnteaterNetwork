/*
 * Anteater Network v14.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

// http://qunitjs.com/cookbook/
// http://msdn.microsoft.com/en-us/library/hh404088.aspx
// http://benalman.com/talks/unit-testing-qunit.html
// 
// Arrange - set up test
// Act - action to be tested
// Assert - evaluation of results

function appendDivs() {
  var $fixture = $("#qunit-fixture");
  $fixture.append("<div id='js-map' style='width: 50%, height: 50px'></div>");
  $fixture.append("<ul id='sidenav'><div id='js-sidenav-inner'></div></ul>");
  $fixture.append("<div id='js-menu-city'></div>");
}


module("Google", {
  setup: function() {
    $.holdReady(true);
    appendDivs();
    $.holdReady(false);
    ok(true, "Setup");
  }
});

test("Load Google Maps API", function() {
  expect(3);

  strictEqual(typeof google, "object", "google is an object");
  strictEqual(typeof google.maps, "object", "google.maps is an object");
});

test("Load Google Maps object", function() {
  expect(2);

  stop();
  google.maps.event.addListenerOnce(gmap.map, "tilesloaded", function() {
    ok(true, "Maps loaded");
    start();
  });
});

module("Markers", {
  setup: function() {
    $.holdReady(true);
    appendDivs();
    $.holdReady(false);
    ok(true, "Setup");
  },
  teardown: function() {
    markers = [];
    xmlhttp = null;
    xmlDoc = null;
    ok(true, "Teardown");
  }
});

test("Count markers", function() {
  expect(4);
  ok(gmap.markers != null, "Markers array exists");
  ok(gmap.markers.length > 1, "Markers array length");
});

test("Validate markers", function() {
  expect(6);
  for (var n = 0; n < 2; n++) {
    var i = Math.floor(Math.random() * gmap.markers.length);
    var latlng = gmap.markers[i].getPosition();
    equal(typeof latlng.lat(), "number", "Marker latitude is number");
    equal(typeof latlng.lng(), "number", "Marker longitude is number");
  }
});


test("Clear all markers", function() {
  expect(4);
  clearMarkers();

  deepEqual([], gmap.markers, "Empty markers array");
  deepEqual([], markersLatLng, "Empty markersLatLng array");
});


module("Filters", {
  setup: function() {
    setFilter("city", "Irvine");
    setFilter("name", "Me");
    setFilter("zipcode", "92617");
    ok(true, "Setup");
  },
  teardown: function() {
    filters = [
    ["city", ""],
    ["name", ""],
    ["zipcode", ""]];
    ok(true, "Teardown");
  }
});

test("Update filters", function() {
  expect(5);
  equal(filters[0][1], "Irvine", "City");
  equal(filters[1][1], "Me", "Name");
  equal(filters[2][1], "92617", "Zipcode");
});

test("Reset all filters", function() {
  expect(5);
  setFilter("city", "Irvine");
  setFilter("name", "Me");
  setFilter("zipcode", "92617");
  clearFilters();
  equal("", filters[0][1], "Empty city filter text");
  equal("", filters[1][1], "Empty name filter text");
  equal("", filters[2][1], "Empty name filter text");

});

test("Create requests from multiple filters", function() {
  expect(5);

  var request = getRequest();
  equal(request, "?city=Irvine&name=Me&zipcode=92617", "City, name and zipcode");

  setFilter("city", "");
  request = getRequest();
  equal(request, "?name=Me&zipcode=92617", "Name and zipcode");

  setFilter("name", "");
  setFilter("city", "Irvine");
  request = getRequest();
  equal(request, "?city=Irvine&zipcode=92617", "City and zipcode");
});
