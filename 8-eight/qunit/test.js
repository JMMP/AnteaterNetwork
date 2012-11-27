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


module("Other");


test("Create XML HTTP Request", function() {
    expect(1);

    createXMLHttpRequest(ok(true, "XML HTTP request created"));
});



test("Update pin drop", function() {
    expect(2);

    updatePinDrop("");
    equal(pinDrop, true, "Pin drop enabled");
    updatePinDrop("Irvine");
    equal(pinDrop, false, "Pin drop disabled");
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

/*
 * Module attempting to use PHP
 * DOES NOT WORK
module("Markers", {
    setup: function() {
        phpFile = "http://instdav.ics.uci.edu/~191grp10/8-eight/andb-connect.php";
        loadMap("qunit-fixture");
        var $fixture = $("#qunit-fixture");
        $fixture.append("<ul id='sidenav'></ul>");
        populate("", "");
        ok(true, "setup");
    }
});
*/


module("Markers", {
    setup: function() {
        createXMLHttpRequest(function () {
            xmlDoc = xmlhttp.responseXML;
        });

        // Data taken from MySQL database and put into an XML
        // with special characters removed (see issue #51 on GitHub)
        phpFile = "test.xml";
        // XMLHttpRequest must be handled synchronously (false)
        sendXMLHttpRequest("", false);
        var $fixture = $("#qunit-fixture");
        $fixture.append("<ul id='sidenav'></ul>");
        ok(true, "Setup");
    },
    teardown: function() {
        markers = [];
        xmlhttp = null;
        xmlDoc = null;
        phpFile = "andb-connect.php?";
        ok(true, "Teardown");
    }
});

test("Create one marker", function() {
    var alumni = parseXML(xmlDoc);
    expect(5);

    var marker = createMarker(alumni[0]);
    var latlng = new google.maps.LatLng(parseFloat(alumni[0].getAttribute("Business_Lat")),
        parseFloat(alumni[0].getAttribute("Business_Lng")));
    deepEqual(latlng, marker.getPosition(), "Latitude and longitude of business");
    var title = alumni[0].getAttribute("Business_Name");
    deepEqual(title, marker.getTitle(), "Title of business");


    equal(1, markers.length, "Markers array length");

})

test("Create random markers", function() {
    var alumni = parseXML(xmlDoc);
    var numMarkers = Math.floor(Math.random() * alumni.length);
    // Each marker created will have 2 tests
    // in addition to setup, teardown, and one from array length
    expect(numMarkers * 2 + 3);

    for (var n = numMarkers; n > 0; n--) {
        var i = Math.floor(Math.random() * alumni.length);
        var marker = createMarker(alumni[i]);
        var latlng = new google.maps.LatLng(parseFloat(alumni[i].getAttribute("Business_Lat")),
            parseFloat(alumni[i].getAttribute("Business_Lng")));
        deepEqual(latlng, marker.getPosition(), "Latitude and longitude of business #" + i);
        var title = alumni[i].getAttribute("Business_Name");
        deepEqual(title, marker.getTitle(), "Title of business #" + i);
    }

    equal(numMarkers, markers.length, "Markers array length");
});


test("Clear all markers", function() {
    expect(5);

    var alumni = parseXML(xmlDoc);
    createMarker(alumni[0]);
    notDeepEqual([], markers, "Full markers array");
    clearMarkers();

    deepEqual([], markers, "Empty markers array");
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


test("Reset one filter", function() {
    expect(5);

    resetFilter("city");
    equal(filters[0][1], "", "City");
    resetFilter("name");
    equal(filters[1][1], "", "Name");
    resetFilter("zipcode");
    ;
    equal(filters[2][1], "", "Zipcode");
});


test("Reset all filters", function() {
    expect(4);

    setFilter("city", "Irvine");
    setFilter("name", "Me");
    setFilter("zipcode", "92617");

    resetFilters();

    equal("", filters[0][1], "Empty city filter text");
    equal("", filters[1][1], "Empty name filter text");

});

test("Create requests (multiple filters)", function() {
    expect(5);

    var request = getRequest();
    equal(request, "city=Irvine&name=Me&zipcode=92617")

    resetFilter("city");
    request = getRequest();
    equal(request, "name=Me&zipcode=92617")

    resetFilter("name");
    setFilter("city", "Irvine");
    request = getRequest();
    equal(request, "city=Irvine&zipcode=92617")
});



module("Search", {
    setup: function() {
        loadMap("qunit-fixture");
        populate('', '');
        var $fixture = $("#qunit-fixture");
        $fixture.append("<ul id='sidenav'></ul>");
        ok(true, "Setup");
    }
});



test("Search by Business Name", function() {
    expect(3);
    strictEqual(typeof xmlDoc, "object", "xmlDoc is an object");
    ok(markers.length > 0, "Markers made");
})