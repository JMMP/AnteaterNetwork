/*
 * Anteater Network v14.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */


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
  ok(gmap.markers.length > 0, "Markers array length");
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

test("Check results", function() {
  expect(3);
  checkResults();
  ok(!$(resultsNoneID).is(":visible"), "Results list not empty");
});

test("Clear all markers", function() {
  expect(4);
  clearMarkers();

  deepEqual([], gmap.markers, "Empty markers array");
  deepEqual([], markersLatLng, "Empty markersLatLng array");
});

test("Clusters", function() {
  expect(6);
  toggleClusters(true);
  equal(typeof gmap.markerClusterer, "object", "Marker clusterer set");
  ok(mc.markers_.length > 0, "Marker clusterer has markers");

  toggleClusters(false);
  equal(gmap.markerClusterer, null, "Marker clusterer removed");
  ok(mc.markers_.length == 0, "Marker clusterer markers cleared");
});

module("Filters", {
  setup: function() {
    setFilter("city", "Irvine");
    setFilter("category", "FOOD");
    setFilter("year", "111111");
    setFilter("school", "ICS");
    setFilter("badentry", "blah");
    ok(true, "Setup");
  },
  teardown: function() {
    for (i in filters)
      filters[i] = "";
    ok(true, "Teardown");
  }
});

test("Set filters", function() {
  expect(8);
  equal(filters.city, "Irvine", "City");
  equal(filters.category, "FOOD", "Category");
  equal(filters.year, "111111", "Year");
  equal(filters.school, "ICS", "School");
  equal(filters.search, "", "Search");
  equal(filters.badentry, undefined, "Bad entry");
});

test("Reset all filters", function() {
  expect(7);
  clearFilters();
  equal(filters.city, "", "City");
  equal(filters.category, "", "Category");
  equal(filters.year, "", "Year");
  equal(filters.school, "", "School");
  equal(filters.search, "", "Search");

});

test("Create requests from multiple filters", function() {
  expect(6);

  var request = getRequest();
  equal(request, "city=Irvine&category=FOOD&year=111111&school=ICS", "City, category, year, and school");

  setFilter("city", "");
  request = getRequest();
  equal(request, "category=FOOD&year=111111&school=ICS", "Category, year, and school");

  setFilter("category", "");
  request = getRequest();
  equal(request, "year=111111&school=ICS", "Year and school");

  setFilter("search", "Hello Pandas");
  request = getRequest();
  equal(request, "search=%2BHello*%20%2BPandas*%20", "Free search");
});
