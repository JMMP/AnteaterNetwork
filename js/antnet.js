/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
 */

var AntNet = {
  alumni: null,
  filtered: null,
  categories: null,
  schools: null,
  infowindow: null,
  filters: {
    school: "",
    category: "",
    search: ""
  },
  map: null,
  mapBounds: null,
  mapStyles: [{
    "featureType": "water",
    "stylers": [{
      "lightness": 14
    }]
  }, {
    "featureType": "road",
    "stylers": [{
      "saturation": 100
    }, {
      "weight": 0.3
    }, {
      "hue": "#002bff"
    }]
  }, {
    "featureType": "landscape",
    "stylers": [{
      "hue": "#00ff44"
    }]
  }, {
    "featureType": "poi.school",
    "stylers": [{
      "saturation": 100
    }, {
      "hue": "#ffe500"
    }]
  }],
  mapOptions: {
    center: new google.maps.LatLng(33.646259, -117.842056),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 12,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.ZoomControlStyle.LARGE
    },
    styles: this.mapStyles
  },
  markers: [],
  markerClusterer: null,
  markerImageBusiness: "img/marker_anteater.png",
  markerImageUser: "img/marker_person.png",

  // FUNCTION init()
  // Initializes Anteater Network, variables, and Google Maps
  init: function() {
    this.map = new google.maps.Map(document.getElementById("js-map"), this.mapOptions);
    this.infowindow = new google.maps.InfoWindow();
    this.getData();
    this.resize();
  },

  // FUNCTION resize()
  // Resizes and reflows HTML elements to match user's screen resolution
  resize: function() {
    // Height of navbar
    var hNavbar = 41;
    // Height of results list header
    var hResultsHeader = 26;
    // Remaining usable height
    var hMax = window.innerHeight - hNavbar;

    // If screen width is less than or equal to 767px,
    // reduce height of results list and map
    /* MOBILE
    var hMobile = 0;
    if (window.innerWidth <= 767)
      hMobile = 250;
    hMax -= hMobile;
    */
    $("#js-results").height(hMax);
    $("#js-results-list").height(hMax - hResultsHeader);

    /* MOBILE
    if (hMobile == 250)
      $("#js-map").height(hMax - $("#js-results").height());
    else*/
    $("#js-map").height(hMax);
  },

  // FUNCTION getData()
  // Makes AJAX call to PHP scripts, gets and stores data of businesses
  getData: function() {
    var that = this;
    $.getJSON("antnet_get.php?antnet")
        .fail(function() { console.log("getData error"); })
        .done(function(data) {
      that.alumni = data.alumni;
      that.categories = data.categories;
      that.schools = data.schools;
      that.setMenus();
      that.update();
    });
  },

  // FUNCTION setMenus()
  // Populates the select menus
  setMenus: function() {
    var that = this;
    $("#js-filter-category").append(this.createMenu(this.categories, "Business_Category"));
    $("#js-filter-category").trigger("chosen:updated");
    $("#js-filter-category").change(function() {
      that.filters.category = $("#js-filter-category").val();
      that.update();
    });
    $("#js-filter-school").append(this.createMenu(this.schools, "School_Name"));
    $("#js-filter-school").trigger("chosen:updated");
    $("#js-filter-school").change(function() {
      that.filters.school = $("#js-filter-school").val();
      that.update();
    });
    $("#js-filter-search").keyup(function() {
      that.filters.search = $("#js-filter-search").val();
      delay(function() {
        that.update();
      }, 500);

    });
  },

  // FUNCTION createMenu(array, column)
  // Creates a select menu with the given array and column name
  createMenu: function(data, field) {
    var fragment = document.createDocumentFragment();
    for (var i in data) {
      var menuOption = document.createElement("option");
      menuOption.appendChild(document.createTextNode(data[i][field]));
      fragment.appendChild(menuOption);
    }
    return fragment;
  },

  // FUNCTION update()
  // Sorts and filters alumni data and calls helper functions to create
  // results list and markers for those businesses
  update: function() {
    this.clear();
    this.filter();

    if (this.filtered.length > 0) {
      $("#js-results-error").hide();
      this.mapBounds = new google.maps.LatLngBounds();
      for (var alumnus in this.filtered)
        this.addBusiness(this.filtered[alumnus]);
      if (!this.mapBounds.isEmpty())
        this.map.fitBounds(this.mapBounds);
    }
  },

  // FUNCTION filter()
  // Filter alumni data to match user input
  filter: function() {
    if (this.filters.category !== "") {
      var filtered = this.filtered;
      this.filtered = [];
      for (var alumnus in filtered) {
        var current = filtered[alumnus];
        if (current.Business_Category.toUpperCase().indexOf(this.filters.category.toUpperCase()) > -1)
          this.filtered.push(current);
      }
    }

    if (this.filters.school !== "") {
      var filtered = this.filtered;
      this.filtered = [];
      for (var alumnus in filtered) {
        var current = filtered[alumnus];
        if (current.School_Name.toUpperCase().indexOf(this.filters.school.toUpperCase()) > -1)
          this.filtered.push(current);
      }
    }

    if (this.filters.search !== "") {
      var terms = this.filters.search;
      // Remove the symbols ; : ' " , . & * + ( ) / \
      terms = terms.replace(/[;:'",.&*+()\/\\]/g, "");
      // Remove leading and trailing spaces
      terms = terms.replace(/^\s+|\s+$/g, "");
      // Replace multiple spaces with single space
      terms = terms.replace(/\s{2,}/g, " ");
      // Convert search terms to upper case
      terms = terms.toUpperCase();
      // Split multiple search terms into array
      terms = terms.split(" ");
      for (var i in terms) {
        var filtered = this.filtered;
        this.filtered = [];
        var query = terms[i];
        for (var alumnus in filtered) {
          var current = filtered[alumnus];
          if (current.id.toUpperCase().indexOf(query) > -1 ||
              current.Last_Name.toUpperCase().indexOf(query) > -1 ||
              current.First_Name.toUpperCase().indexOf(query) > -1 ||
              current.Class_Year.toUpperCase().indexOf(query) > -1 ||
              current.School_Name.toUpperCase().indexOf(query) > -1 ||
              current.Business_Title.toUpperCase().indexOf(query) > -1 ||
              current.Business_Name.toUpperCase().indexOf(query) > -1 ||
              current.Business_Category.toUpperCase().indexOf(query) > -1 ||
              current.Business_Street1.toUpperCase().indexOf(query) > -1 ||
              current.Business_Street2.toUpperCase().indexOf(query) > -1 ||
              current.Business_City.toUpperCase().indexOf(query) > -1 ||
              current.Business_State.toUpperCase().indexOf(query) > -1 ||
              current.Business_Country.toUpperCase().indexOf(query) > -1 ||
              current.Business_Zipcode.toUpperCase().indexOf(query) > -1 ||
              current.Business_Phone.toUpperCase().indexOf(query) > -1) {
            this.filtered.push(current);
          }
        }
      }
    }
  },

  // FUNCTION addBusiness(alumnus)
  // Creates a marker, infowindow, and result listing for a single business
  addBusiness: function(alumnus) {
    var latLngBuffer = 0.0035;
    var busLat = parseFloat(alumnus.Business_Lat);
    var busLng = parseFloat(alumnus.Business_Lng);

    // Check if needed fields exists, then store and format them accordingly
    var busName = alumnus.Business_Name;
    var busStreet1 = "";
    var busStreet2 = "";
    var busCity = "";
    var busState = "";
    var busCountry = "";
    var busZipcode = "";
    if (alumnus.Business_Street1 !== "") {
      busStreet1 = alumnus.Business_Street1;
      if (alumnus.Business_Street2 !== "")
        busStreet2 = ", " + alumnus.Business_Street2;
    }
    if (alumnus.Business_City !== "") {
      busCity = alumnus.Business_City;
      if (alumnus.Business_State !== "")
        busState = ", " + alumnus.Business_State;
    }
    if (alumnus.Business_Country !== "")
      busCountry = ", " + alumnus.Business_Country;
    if (alumnus.Business_Zipcode !== "")
      busZipcode = " " + alumnus.Business_Zipcode;
    var busAddress = busName + ", " + busStreet1 + busCity + busState + busZipcode;

    // Create result listing content
    var fragment = document.createDocumentFragment();
    var resultLI = document.createElement("li");
    var resultA = document.createElement("a");
    var resultTitle = document.createElement("b");
    resultTitle.appendChild(document.createTextNode(busName));
    resultTitle.appendChild(document.createElement("br"));
    var resultDesc = document.createElement("span");
    resultDesc.innerHTML = busCity + busState;
    resultA.appendChild(resultTitle);
    resultA.appendChild(resultDesc);
    resultLI.appendChild(resultA);
    fragment.appendChild(resultLI);
    $("#js-results-list").append(fragment);

    // Create a marker and infowindow for businesses with latitudes and longitudes
    // Businesses with latitude or longitude of 0 are still displayed in results list
    if (busLat == 0 || busLng == 0) {
      $(resultLI).click(function() {
        $("#js-results-list").children("li").removeClass("active");
        $(resultLI).addClass("active");
      });
    } else {
      // Create marker
      var marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(busLat, busLng),
        title: busName,
        icon: this.markerImageBusiness
      });
      this.markers.push(marker);

      // Create buffered LatLngs for map view bounds
      var latLngNE = new google.maps.LatLng(busLat + latLngBuffer, busLng + latLngBuffer);
      var latLngSW = new google.maps.LatLng(busLat - latLngBuffer, busLng - latLngBuffer);
      this.mapBounds.extend(latLngNE);
      this.mapBounds.extend(latLngSW);

      // Create infowindow content
      var infowindowContent = "<b>" + busName + "</b><br />";
      infowindowContent += "<p>" + alumnus.First_Name + " " + alumnus.Last_Name + "<br />" +
          busStreet1 + busStreet2 + "<br />" + busCity + busState + busCountry + busZipcode +
          "<br />" + alumnus.Business_Phone + "</p>";
      infowindowContent += "<a href='http://maps.google.com/maps?daddr=" + busAddress.replace(" ", "+") + "' target ='_blank'>Get Directions</a>";
      var infowindowHTML = '<div class="js-infowindow">' + infowindowContent + '</div>';

      // Open infowindow and scroll to results listing when marker is clicked
      var that = this;
      google.maps.event.addListener(marker, "click", function() {
        that.infowindow.setContent(infowindowHTML);
        that.infowindow.open(that.map, marker);
        var posTop = $("#js-results-list").scrollTop() +
            $(resultLI).position().top - $("#js-results-list").position().top;
        $("#js-results-list").animate({
          scrollTop: posTop
        }, 700);
        $("#js-results-list").children("li").removeClass("active");
        $(resultLI).addClass("active");
      });

      // Focus marker and open infowindow when results listing is clicked
      $(resultLI).click(function() {
        that.map.panTo(marker.position);
        that.infowindow.setContent(infowindowHTML);
        that.infowindow.open(that.map, marker);
        $("#js-results-list").children("li").removeClass("active");
        $(resultLI).addClass("active");
      });
    }
  },

  // FUNCTION clear()
  // Clears the list and map, and show the No Results notice
  clear: function() {
    if ($("#js-results-error").is(":hidden")) {
      $("#js-results-list").children().remove();
      $("#js-results-error").show();
      for (var i = 0; i < this.markers.length; i++)
        this.markers[i].setMap(null);
    }
    this.markers = [];
    this.filtered = this.alumni;
  }
};

var delay = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

// When DOM is loaded, initialize system and enable Google Maps visual refresh
$(document).ready(function() {
  AntNet.init();
  google.maps.visualRefresh = true;
  $(".js-select").chosen({
      allow_single_deselect: true
    });
});

// Call AntNet.resize() whenever the window is resized
$(window).resize(function() {
  AntNet.resize();
});