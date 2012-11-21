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
        // Create XML string
        var text = "<alumni>";
        text += "<alumnus ID_Number='4898' Last_Name='Carr' First_Name='Paul' Class_Year='1972' School_Code='HUM' Business_Title='Chairman of the Board' Business_Name='C&C Partners Ltd.' Business_Street1='9600 Toledo Way' Business_Street2='' Business_City='Irvine' Business_State='CA' Business_Zipcode='92618' Business_Phone='' Business_Phone_Ext='' Business_Lat='33.653805' Business_Lng='-117.710892'/>";
        text += "<alumnus ID_Number='4914' Last_Name='Burke' First_Name='Kenneth' Class_Year='1974' School_Code='SOC' Business_Title='President' Business_Name='CMS Products Inc.' Business_Street1='12 Mauchly Ste E' Business_Street2='' Business_City='Irvine' Business_State='CA' Business_Zipcode='92618' Business_Phone='2147483647' Business_Phone_Ext='' Business_Lat='33.654770' Business_Lng='-117.735100'/>";
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


test("Create marker", function() {
    
    /*
    var numTests = 4;
    expect(numTests * 2 + 1);
    var alumni = parseXML(xmlDoc);
    
    alert(alumni[0]);

    while (numTests > 0) {
        var i = Math.floor(Math.random() * alumni.length);
        var marker = createMarker(alumni[i]);
        var latlng = new google.maps.LatLng(parseFloat(alumni[i].getAttribute("Business_Lat")), 
            parseFloat(alumni[i].getAttribute("Business_Lng")));
        deepEqual(latlng, marker.getPosition());
        equal(alumni[i].getAttribute("Business_Name"), marker.getTitle);
        numTest--;
    }
*/

    var alumni = parseXML(xmlDoc);
    var i = 0;
    var marker = createMarker(alumni[i]);
    strictEqual(typeof google.maps.LatLng, marker.getPosition());
    
});

test("Clear all markers", function() {
    expect(4);

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
    }
});

test("Update filters", function() {
    expect(4);
    equal(filters[0][1], "Irvine", "City");
    equal(filters[1][1], "Me", "Name");
    equal(filters[2][1], "92617", "Zipcode");   
});


test("Reset one filter", function() {
    expect(4);

    resetFilter("city");
    equal(filters[0][1], "", "City");
    resetFilter("name");
    equal(filters[1][1], "", "Name");
    resetFilter("zipcode");;
    equal(filters[2][1], "", "Zipcode");
    
    
    
});


test("Reset all filters", function() {
    expect(3);

    setFilter("city", "Irvine");
    setFilter("name", "Me");
    setFilter("zipcode", "92617");

    resetFilters();

    equal("", filters[0][1], "Empty city filter text");
    equal("", filters[1][1], "Empty name filter text");

});

test("Requests (multiple filters)", function() {
    expect(4);
    
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


