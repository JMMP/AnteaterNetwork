![Anteater Network](http://i.imgur.com/4oVj3.png)
![JMMP](http://i.imgur.com/lw4AT.png)
# Anteater Network [12.1](http://instdav.ics.uci.edu//~191grp10/AnteaterNetwork/) Beta
### © 2013 [JMMP](https://github.com/JMMP) (Jola Bolaji, Mark Chege, Melvin Chien, Patrick Chen) in association with UCI Alumni Association, University of California, Irvine.

[Features](#features) | [Changelog](#changelog) | [Resources](#resources) | [License](#license)

- - -
### Features
##### Interface 70%
* Hide-able results list
* Automatic populating menus
* Support online businesses
* Custom CSS styling
* Filter by city
* _Filter by business type_
* Search by business name
* _Search by zipcode_
* _Update My Information form_

##### Map 80%
* _Auto focus on search_
* Google Maps directions
* Marker clusterers
* Buffer zone around results

##### Back End 25%
* Full UCI alumni database
* _Automatic merging of old and new databases_
* _Deploy on live server_

##### Social Media 90%
* Twitter
* Facebook
* LinkedIn
* Google+


### Changelog
##### Version 12.2 February XX, 2013
1. Converted XMLHttpRequests to use jQuery AJAX calls. Fixed [issue #99](https://github.com/JMMP/AnteaterNetwork/issues/99).

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


### Resources
VPN: <http://www.oit.uci.edu/security/vpn.html>  
[Windows](http://www.ics.uci.edu/computing/account/mapdrive_win.php): \\\\samba.ics.uci.edu\191grp10  
[Mac](http://www.ics.uci.edu/computing/account/mapdrive_mac.php): smb://samba.ics.uci.edu/191grp10  
Username: UCI-ICS\username  
[Log in with SSH](http://www.ics.uci.edu/computing/linux/hosts.php)  

[jquery-ui-map](http://code.google.com/p/jquery-ui-map/)  
[Gmap3](http://gmap3.net/)  
[gmaps.js](http://hpneo.github.com/gmaps/)  
[Initialize Google Map in AngularJS](http://stackoverflow.com/questions/11180750/initialize-google-map-in-angularjs)  
[Google Maps for AngularJS](http://nlaplante.github.com/angular-google-maps/)  
[3 Reasons to Choose AngularJS](http://net.tutsplus.com/tutorials/javascript-ajax/3-reasons-to-choose-angularjs-for-your-next-project/)  
[Async Tasks With JQuery Promises](http://net.tutsplus.com/tutorials/JavaScript-ajax/wrangle-async-tasks-with-jquery-promises/)  
[JQuery Deferred Object](http://api.jquery.com/category/deferred-object/)  
[bootstrap-tour](https://github.com/sorich87/bootstrap-tour)  
[bootstrap-switch](https://github.com/nostalgiaz/bootstrap-switch)  

##### Facebook Like Button
<https://developers.facebook.com/docs/reference/plugins/like/>

````javascript
<div id="fb-root"></div>

	<script>(function(d, s, id) {

	var js, fjs = d.getElementsByTagName(s)[0];

	if (d.getElementById(id)) return;
	
	js = d.createElement(s); js.id = id;
		
	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	fjs.parentNode.insertBefore(js, fjs);
	
	}(document, 'script', 'facebook-jssdk'));
</script>

<iframe src='//www.facebook.com/plugins/like.php?href=https%3A%2F%2Finstdav.ics.uci.edu%2F%7E191grp10%2F5-fivevariant%2F&amp;send=false&amp;layout=button_count&amp;width=60&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:100px; height:21px;' allowTransparency='true'></iframe>
````

##### Google+ Button
<https://developers.google.com/+/plugins/+1button/>

````javascript
var google_plus = "<div class='g-plusone' data-size='small' data-annotation='none' data-href='https://instdav.ics.uci.edu/~191grp10/5-fivevariant/'></div>";

<script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
````

##### Tweet Button
<https://twitter.com/about/resources/buttons#tweet>
````javascript
<a href="https://twitter.com/share" class="twitter-share-button" data-count="none">Tweet</a>

<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
````


### License
All files are Copyright 2013 [JMMP](https://github.com/JMMP) unless otherwise stated. Please ask for permission to use any of the contents by submitting an issue for this repository. Thank you!