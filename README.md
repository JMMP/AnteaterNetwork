# Anteater Network 5
### © 2012 Team JMMP in association with UCI Alumni Association, University of California, Irvine.
##### Jola Bolaji, Mark Chege, Melvin Chien, Patrick Chen

- - -
### Changelog
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


### Working Features
1. Reset Markers
* Search by City Dropdown
* Search by Zip Code
* Multiple Filters (hardcoded)


### To Implement
1. Results box
* CSS styling
* Pin density function
* Map auto zoom and focusing

### Known Issues
1. Markers not being shown properly after applying a filter and then un-applying it
  * Selecting the default value or clearing the textbook will not show the expected businesses
  * This issue is not present when more than one filter is in use
* Map styling is difficult to see
* Marker icons don't have shadows
* Search by City Instant-Search drops the pin every letter
* Phantom Pin appearing in top left corner, appears with Irvine, 