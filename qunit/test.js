// http://qunitjs.com/cookbook/
// http://msdn.microsoft.com/en-us/library/hh404088.aspx
// http://benalman.com/talks/unit-testing-qunit.html
/*
 * Arrange - set up test
 * Act - action to be tested
 * Assert - evaluation of results
 *
 */

module("Google", {
    setup: function() {
        loadMap("qunit-fixture");
        ok(true, "Setup");
    }
});


test("Load Google Maps API", function() {
    expect(3);

    //var fixture = $("#qunit-fixture" );
    // If the API was not loaded, this would return errors
    strictEqual(typeof google, "object", "google is an object");
    strictEqual(typeof google.maps, "object", "google.maps is an object");
});


test("Load Google Maps object", function() {
    expect(2);
    // Tell QUnit to wait
    stop();
    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        ok(true, "Maps loaded");
        start();
    });
});


module("Map", {
    setup: function() {
        loadMap("qunit-fixture");
        ok(true, "Setup");
    }
});


test("Create XML HTTP Request", function() {
    expect(2);
    
    createXMLHttpRequest(ok(true, "XML HTTP request created"));
});


test("Update pin drop", function() {
    expect(3);
    
    updatePinDrop("");
    equal(pinDrop, true, "Pin drop enabled");
    updatePinDrop("Irvine");
    equal(pinDrop, false, "Pin drop disabled");
});


test("Reset filters", function() {
    expect(3);

    filters[0][1] = "Irvine";
    filters[1][1] = "Micrometals";

    resetFilters();

    equal("", filters[0][1], "Empty city filter text");
    equal("", filters[1][1], "Empty name filter text");

});


module("XML", {
    setup: function() {
        // Create XML string
        var text = "<alumni>";
        text += "<alumnus ";
        text += "First_Name='Evelyn' ";
        text += "Last_Name='Giada' ";
        text += "Class_Year='2005' ";
        text += "/>";
        text += "</alumni>";

        // Set up a basic XML DOM to parse string
        
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(text,"text/xml");
        } else {
            // Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(text); 
        }
        ok(true, "Setup");
    }
});


test("Parse XML", function() {
    expect(4);
    
    
    
    var alumni = parseXML(xmlDoc);
    
    equal(alumni[0].getAttribute("First_Name"), "Evelyn", "First name");
    equal(alumni[0].getAttribute("Last_Name"), "Giada", "Last name");
    equal(alumni[0].getAttribute("Class_Year"), "2005", "Class name");
    
});


module("Populate", {
    setup: function() {
        loadMap("qunit-fixture");
        populate("", "");
        ok(true, "Setup");
    }
});


test("Clear all markers", function() {
    expect(4);

    notDeepEqual([], markers, "Full markers array");
    clearMarkers();

    deepEqual([], markers, "Empty markers array");
    deepEqual([], markersLatLng, "Empty markersLatLng array");
});