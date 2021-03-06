![Anteater Network](img/antnet_logo_full.png)  
![JMMP](img/jmmp_logo.png)
# Anteater Network [15.0](http://alumni.uci.edu/anteater-network)  
### © 2013 [JMMP](http://github.com/JMMP/) (Jola Bolaji, Mark Chege, Melvin Chien, Patrick Chen) and the [UC Irvine Alumni Association](http://alumni.uci.edu).

- - -
### Features
##### Interface
* Hide-able results list
* Automatic populating menus
* Auto focus on search
* Supports online businesses
* Custom CSS styling
* Toggle clusters
* Clear all filters
* Google Maps directions
* Marker clusterers
* Buffer zone around results
* Geolocation
* Filter by category or school
* Instant free search
* Mobile friendly


### Changelog
##### Version 15.0 September 9, 2013
1. Rebuilding system from scratch!
* Added [Bootstrap](http://twitter.github.io/bootstrap/) 2.3.2.
* Added Cerulean Bootstrap theme by [Bootswatch](http://bootswatch.com/2/).
* Added [jQuery](http://jquery.com) 1.10.2.
* Optimized images
* Added [Marker Clusterer](http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/) 1.0.
* Added [Chosen](http://harvesthq.github.io/chosen/) 1.0.0.
* Created basic user interface layout.
* Removed Bootstrap Responsive CSS.
* Added [Bootstrap Modal](http://jschr.github.io/bootstrap-modal/).
* Added [Font Awesome](http://fortawesome.github.com/Font-Awesome).
* Added responsive features.
* Integrated into UCIAA site.
* Redid Anteater Network logo.

##### Version 14.1 June 30, 2013
1. Encoded all filter values, not just search. Fixed [issue #139](https://github.com/JMMP/AnteaterNetwork/issues/139).
* Added Reset button to Search menu.

##### Version 14.0 March 10, 2013
1. Converted filters from an array to an object with properties.
* Updated QUnit tests. Fixed [issue #128](https://github.com/JMMP/AnteaterNetwork/issues/128).
* Auto resize map and results list depending on height of window.
* Use [Font Awesome](http://fortawesome.github.com/Font-Awesome/) instead of Fontello.
* Updated Bootstrap, jQuery, jQuery UI, QUnit, and GMaps to use CDNs.
* Updated bootstrapSwitch to 1.2.
* Updated LICENSES file.
* Added smarter select boxes with [Bootstrap Combobox](https://github.com/danielfarrell/bootstrap-combobox). Fixed [issue #93](https://github.com/JMMP/AnteaterNetwork/issues/93).
* Added toggle to switch between search and filters.
* Adjusted responsive behavior of menu bar. Fixed [issue #136](https://github.com/JMMP/AnteaterNetwork/issues/136).
* Default to filters for desktops.

##### Version 13.2 February 28, 2013
1. Added geolocation. Fixed [issue #105](https://github.com/JMMP/AnteaterNetwork/issues/105).
* Added map focusing to marker when listing is clicked. 
* Commented our JavaScript and PHP code. Fixed [issue #123](https://github.com/JMMP/AnteaterNetwork/issues/123).
* Added business category and alumni school name to free search. Fixed [issue #132](https://github.com/JMMP/AnteaterNetwork/issues/132).
* Removed dependency on alumni ID numbers. Fixed [issue #129](https://github.com/JMMP/AnteaterNetwork/issues/129).
* Fixed no results notice not showing up. Fixed [issue #134](https://github.com/JMMP/AnteaterNetwork/issues/134).
* Fixed free search tooltip positioning.
* Added responsive behavior to menu bar. Fixed [issue #95](https://github.com/JMMP/AnteaterNetwork/issues/95).
* Added currently applied filters bar. Fixed [issue #106](https://github.com/JMMP/AnteaterNetwork/issues/106).
* Redid the anteater in Anteater Network logo. Fixed [issue #130](https://github.com/JMMP/AnteaterNetwork/issues/130).

##### Version 13.1 February 23, 2013
1. Fixed map jumping to bottom of page when results list is hidden or shown. Fixed [issue #98](https://github.com/JMMP/AnteaterNetwork/issues/98).
* Added more school names based on [UCI's Academics page](http://uci.edu/academics.php).
* Updated Bootstrap to 2.3.0.
* Set loading bar to only show when there is something actually being loaded.
* Updated Schools menu with proper full school names.
* Started progress on admin panel. Fixed [issue #111](https://github.com/JMMP/AnteaterNetwork/issues/111).
* Changed color of marker icon.
* Set businesses with no category to Other. Fixed [issue #122](https://github.com/JMMP/AnteaterNetwork/issues/122).
* Remove marker clusterer when it is turned off. Fixed [issue #86](https://github.com/JMMP/AnteaterNetwork/issues/86).
* Updated GMaps to 0.3.

##### Version 13.0 February 18, 2013
1. Display "(No Title)" for businesses without a name. Fixed [issue #100](https://github.com/JMMP/AnteaterNetwork/issues/100).
* Center map on USA on first load. Fixed [issue #115](https://github.com/JMMP/AnteaterNetwork/issues/115).
* Implement PHP variable validation to prevent against SQL injections.
* Businesses without a name will not be displayed.
* Added free search. Fixed [issue #68](https://github.com/JMMP/AnteaterNetwork/issues/68).
* Fixed check for first load of web page. Fixed [issue #118](https://github.com/JMMP/AnteaterNetwork/issues/118).
* Removed populate from Clear Filters button. Fixed [issue #116](https://github.com/JMMP/AnteaterNetwork/issues/116).
* Use boolean mode for full-text searching. Fixed [issue #117](https://github.com/JMMP/AnteaterNetwork/issues/117).
* Added negate operator to free search to allow for certain terms to be excluded.
* Convert school codes to full school names. Fixed [issue #110](https://github.com/JMMP/AnteaterNetwork/issues/110).
* Added tooltip for excluding search terms.
* Removed zip code search.
* Implemented business categories filter. Fixed [issue #120](https://github.com/JMMP/AnteaterNetwork/issues/120).

##### Version 12.2 February 12, 2013
1. Converted XMLHttpRequests to use jQuery AJAX calls. Fixed [issue #99](https://github.com/JMMP/AnteaterNetwork/issues/99).
* Added searching by school/major and class year.
* Fixed filters for major and class year. Fixed [issue #109]https://github.com/JMMP/AnteaterNetwork/issues/109).
* Coverted PHP MySQL API from [mysql](http://www.php.net/manual/en/book.mysql.php) to [mysqli](http://www.php.net/manual/en/book.mysqli.php). See [this](http://www.php.net/manual/en/mysqlinfo.api.choosing.php) for a comparison of the different MySQL APIs PHP offers.
* Escaped special characters in strings for SQL statements sent to database. Fixed [issue #78](https://github.com/JMMP/AnteaterNetwork/issues/78).
* Implemented sleep function to geocoding in order to avoid hitting Google's rate limit. Fixed [issue #108](https://github.com/JMMP/AnteaterNetwork/issues/108).
* Move geocoding to separate file and clean up code. Fixed [issue #102](https://github.com/JMMP/AnteaterNetwork/issues/102).
* Updated QUnit JavaScript unit tests.
* Check for no results using the results list. Fixed [issue #113](https://github.com/JMMP/AnteaterNetwork/issues/113).

##### Version 12.1 February 6, 2013
1. Fixed highlighting in results list. Fixed [issue #101](https://github.com/JMMP/AnteaterNetwork/issues/101).
* Fixed highlighting in menus.
* Changed order of navbar items.

##### Version 12.0 February 6, 2013
1. Added transparency to tooltips. Fixed [issue #92](https://github.com/JMMP/AnteaterNetwork/issues/92).
* Added toggle to hide results list. Fixed [issue #94](https://github.com/JMMP/AnteaterNetwork/issues/94).
* Added styling to infowindows. Fixed [issue #27](https://github.com/JMMP/AnteaterNetwork/issues/27).
* Minor changes to Hide and Show buttons from user testing.
* Added basic geocoding. Fixed [issue #81](https://github.com/JMMP/AnteaterNetwork/issues/81).

##### Version 11.0 February 3, 2013
1. Rebuilt Anteater Network again, from bottom up.
* Enable Bootstrap responsive features. Fixed [issue #77](https://github.com/JMMP/AnteaterNetwork/issues/77).
* Added social network icons by Brandico from [Fontello](http://fontello.com/).
* Added switches from [bootstrap-switch](https://github.com/nostalgiaz/bootstrap-switch).
* Added [gmaps.js](http://hpneo.github.com/gmaps/).
* Added code from 10.3 for basic functionality.
* Added map zooming / focusing.
* Added marker clusterer.
* Fixed results list display problems.
* Added button for clearing all filters.
* Fixed filters not clearing.
* Fixed info windows opening when listing is clicked.
* Fixed dropdown listing highlighting when clicked.
* Fixed results list highlighting when marker is clicked.
* Added loading bar. Fixed [issue #71](https://github.com/JMMP/AnteaterNetwork/issues/71).
* Fixed loading bar transparency.
* Input boxes are cleared when filters are cleared. Fixed [issue #89](https://github.com/JMMP/AnteaterNetwork/issues/89).
* Driving directions use full addresses rather than coordinates. Fixed [issue #90](https://github.com/JMMP/AnteaterNetwork/issues/90).
* Fixed rounded corners of loading bar.
* Removed max image widths. Fixed [issue #88](https://github.com/JMMP/AnteaterNetwork/issues/88).
* Added QUnit JavaScript testing. Fixed [issue #79](https://github.com/JMMP/AnteaterNetwork/issues/79).
* Added tooltip help over buttons. Fixed [issue #82](https://github.com/JMMP/AnteaterNetwork/issues/82).

##### Version 10.0 January 25, 2013
1. Fixed some bugs related the order scripts were loaded
* Removed header
* Implemented [Bootstrap](http://twitter.github.com/bootstrap/)
* Added new logo to navigation menu
* Fixed spacing issues
* Fixed never ending drop down menus
* Updated QUnit tests

##### Version 9.0 December 10, 2012
1. Added buffer of ±0.003 degrees to latitude and longitude of each pin. Fixed [issue #45](https://github.com/JMMP/AnteaterNetwork/issues/45).
* Map stays in place when there are no markers to display. Fixed [issue #33](https://github.com/JMMP/AnteaterNetwork/issues/33).
* Implemented marker clusterer. Fixed [issue #9](https://github.com/JMMP/AnteaterNetwork/issues/9).
* Adjusted pull tab code to use two different images on open and close. Fixed [issue #65](https://github.com/JMMP/AnteaterNetwork/issues/65).
* City menu and markers now populate after the map is loaded, rather than at the same time. City menu also populates at the same time as markers populate to prevent stalling the page. Fixed [issue #67](https://github.com/JMMP/AnteaterNetwork/issues/67).
* Added a second XMLHttpRequest object. Fixed [issue #60](https://github.com/JMMP/AnteaterNetwork/issues/60).
* Clicking a business in the results box will fit the marker to the screen and open the info window. Fixed [issue #66](https://github.com/JMMP/AnteaterNetwork/issues/66).
* Changed a for in loop to a standard for loop as it was not parsing through the array correctly. Fixed [issue #55](https://github.com/JMMP/AnteaterNetwork/issues/55).
* Added a debug table at the bottom of the page.
* Added a response timer in milliseconds which updates on every populate call.
* Marker clusters update whenever filters are being applied. Fixed [issue #64](https://github.com/JMMP/AnteaterNetwork/issues/64).

##### Version 8.0 December 5, 2012
1. Map is clickable again. Fixed [issue #48](https://github.com/JMMP/AnteaterNetwork/issues/48).
* Added social network logos for Facebook, Twitter, and Google Plus.
* Various CSS changes and fixes.
* Updated Anteater Network logo to include slogan, position and size is yet to be adjusted.
* Progress towards [issue #9](https://github.com/JMMP/AnteaterNetwork/issues/9).
* Added tab to hide and show results box. Fixed [issue #22](https://github.com/JMMP/AnteaterNetwork/issues/22).
* Progress on [issue #46](https://github.com/JMMP/AnteaterNetwork/issues/46), added feature based QUnit JavaScript unit tests.
* Pressing Enter no longer refreshes page. Fixed [issue #11](https://github.com/JMMP/AnteaterNetwork/issues/11).
* Zipcode search uses button or Enter key. Fixed [issue #36](https://github.com/JMMP/AnteaterNetwork/issues/36).
* Updated GitHub page <http://jmmp.github.com/AnteaterNetwork>.
* Replaced text box values with placeholders. Fixed [issue #28](https://github.com/JMMP/AnteaterNetwork/issues/28).
* Changed "Name" to "Business Name". Fixed [issue #31](https://github.com/JMMP/AnteaterNetwork/issues/31).
* Added link to get directions in info windows. Fixed [issue #52](https://github.com/JMMP/AnteaterNetwork/issues/52).
* Completed feature based QUnit JavaScript unit tests. Fixed [issue #46](https://github.com/JMMP/AnteaterNetwork/issues/46).
* Added LinkedIn button. Fixed [issue #53](https://github.com/JMMP/AnteaterNetwork/issues/53).
* Implemented larger database. Fixed [issue #39](https://github.com/JMMP/AnteaterNetwork/issues/39).
* City menu auto populates from database. Fixed [issue #12](https://github.com/JMMP/AnteaterNetwork/issues/12).
* Results box is sorted alphabetically by business name. Fixed [issue #18](https://github.com/JMMP/AnteaterNetwork/issues/18).
* Missing information will not be displayed. Fixed [issue #62](https://github.com/JMMP/AnteaterNetwork/issues/62).


##### Version 7.0 November 14, 2012
1. Fixed [issue #21](https://github.com/JMMP/AnteaterNetwork/issues/21), added JMMP logo and slogan to header and created footer
* Fixed [issue #24](https://github.com/JMMP/AnteaterNetwork/issues/24), Rancho San Margarita had wrong value in HTML form.
* Added GitHub Page at <http://jmmp.github.com/AnteaterNetwork>.
* Fixed [issue #37](https://github.com/JMMP/AnteaterNetwork/issues/37), turned off animation for pins except on first populate.
* Fixed [issue #20](https://github.com/JMMP/AnteaterNetwork/issues/20), text searches are case insensitive.
* Fixed [issue #16](https://github.com/JMMP/AnteaterNetwork/issues/16), fixed filter menu moving up and down.
* Fixed [issue #29](https://github.com/JMMP/AnteaterNetwork/issues/29), moved results box to left side.
* Fixed [issue #32](https://github.com/JMMP/AnteaterNetwork/issues/32), removed Filter By.
* Fixed [issue #30](https://github.com/JMMP/AnteaterNetwork/issues/30), moved text boxes into drop down menus.
* Made main JavaScript code more modular.
* Fixed [issue #40](https://github.com/JMMP/AnteaterNetwork/issues/40), skipping PHP unit tests.
* Fixed [issue #41](https://github.com/JMMP/AnteaterNetwork/issues/41), set up initial QUnit JavaScript unit tests.
* Fixed [issue #42](https://github.com/JMMP/AnteaterNetwork/issues/42), skipping user interface tests.
* Fixed [issue #26](https://github.com/JMMP/AnteaterNetwork/issues/26), moved zoom controls to right side of map.
* Fixed [issue #44](https://github.com/JMMP/AnteaterNetwork/issues/44), drop down menus show above map.

##### Version 6.0 October 29, 2012
1. Updated README with Changelog
* Started using Github Issues
* Fixed [issue #1](https://github.com/JMMP/AnteaterNetwork/issues/1)
* Facebook, Google Plus, Twitter, and LinkedIn integrated in 5-fivevariant
* Fixed [issue #10](https://github.com/JMMP/AnteaterNetwork/issues/10), zoomed and centered map on markers
* Added basic results list that updates on filter changes
* Fixed [issue #2](https://github.com/JMMP/AnteaterNetwork/issues/2), updated map colours to be more neutral
* Fixed [issue #5](https://github.com/JMMP/AnteaterNetwork/issues/5), added check to not display businesses without addresses on map
* Fixed [issue #13](https://github.com/JMMP/AnteaterNetwork/issues/13), related to #5.
* Map refocuses on UCI if there are no pins to show on map
* Fixed [issue #6](https://github.com/JMMP/AnteaterNetwork/issues/6), implemented results box on the right side.
* Fixed [issue #8](https://github.com/JMMP/AnteaterNetwork/issues/8), basic styling of almost all elements on page.

##### Version 5.0 October 26, 2012
1. Added map styling from Patrick
* Adjusted default zoom
* Added custom marker icon
* Added filter functionality for business names, cities, and zip code
(zip code is only a direct match)
* Combined multiple JavaScript filters into one populate() function
* Added (hardcoded) functionality for more than one filter being applied
at the same time
* Fixed markers' info windows not being closed automatically
* Added more information inside info windows

##### Version 0.0 June 2012
1. Prototype

### License
Please see LICENSES.
