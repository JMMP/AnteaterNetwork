// http://qunitjs.com/cookbook/
// http://msdn.microsoft.com/en-us/library/hh404088.aspx
/* 
 * Arrange - set up test
 * Act - action to be tested
 * Assert - evaluation of results
 * 
 */


test("Create marker", function() {
    //expect(0);
    var alumni = 
    createMarkers(alumni);
});

test("Clear markers", function() {
    expect(2);
    
    clearMarkers();
    
    deepEqual([], markers, "Empty markers array");
    deepEqual([], markersLatLng, "Empty markersLatLng array");
    
});

test("Reset filters", function() {
    expect(2);
    
    filters[0][1] = "Irvine";
    filters[1][1] = "Micrometals";
    
    resetFilters();
    
    equal("", filters[0][1], "Empty city filter text");
    equal("", filters[1][1], "Empty name filter text");
    
});

/*
 * Unit/Module Test Suites:
Searching for business name
Searching by zip code
Filtering by city
Filtering by business type
Reset filters
Sharing results
Add entry to database
Edit entry in database
Remove entry from database

Scenario Based Test Suite:
Controlled and monitored environment test
UCI Campus environment test
Mobile environment test

 */