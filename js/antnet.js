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
  sizes: null,
  infowindow: null,
  map: null,
  filters: {
    school: "",
    category: "",
    search: ""
  },
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
    zoom: 15,
    panControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT,
      style: google.maps.ZoomControlStyle.LARGE
    },
    styles: this.mapStyles
  },
  mapViewBuffer: 0.0035,
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
    $(".js-select").chosen({
      allow_single_deselect: true
    });
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
      that.sizes = data.sizes;
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
      for (var alumnus in this.filtered)
        this.addBusiness(this.filtered[alumnus]);
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
      // Remove leading and trailing spaces
      terms.replace(/^\s+|\s+$/g, "");
      // Replace multiple spaces with single space
      terms.replace(/\s{2,}/g, " ");
      // Split multiple search terms into array
      terms = terms.split(" ");
      for (var i in terms) {
        var filtered = this.filtered;
        this.filtered = [];
        var query = terms[i].toUpperCase();        
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
  // Creates a marker, infowindow, and listing for a single business
  addBusiness: function(alumnus) {
    var marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(alumnus.Business_Lat, alumnus.Business_Lng),
      title: alumnus.Business_Name,
      icon: this.markerImageBusiness
    });
    this.markers.push(marker);

    // Create infowindow content
    var infowindowContent = "<b>" + alumnus.Business_Name + "</b><br />";
    infowindowContent += "<p>" + alumnus.First_Name + " " + alumnus.Last_Name + "</p>";
    var infowindowHTML = '<div class="js-infowindow">' + infowindowContent + '</div>';

    // Create listing content
    var fragment = document.createDocumentFragment();
    var resultLI = document.createElement("li");
    var resultA = document.createElement("a");
    var resultTitle = document.createElement("b");
    resultTitle.appendChild(document.createTextNode(alumnus.Business_Name));
    resultTitle.appendChild(document.createElement("br"));
    var resultDesc = document.createElement("span");
    resultDesc.innerHTML = alumnus.Business_Street1 + "<br />" + alumnus.Business_City +
            ", " + alumnus.Business_State + " " + alumnus.Business_Zipcode;
    resultA.appendChild(resultTitle);
    resultA.appendChild(resultDesc);
    resultLI.appendChild(resultA);
    fragment.appendChild(resultLI);
    $("#js-results-list").append(fragment);

    // Open infowindow and scroll to listing when marker is clicked
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

    // Focus marker and open infowindow when listing is clicked
    $(resultLI).click(function() {
      that.map.panTo(marker.position);
      that.infowindow.setContent(infowindowHTML);
      that.infowindow.open(that.map, marker);
      $("#js-results-list").children("li").removeClass("active");
      $(resultLI).addClass("active");
    });
  },

  // FUNCTION clear()
  // Clears the results list and map, and show the No Results notice
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
});

// Call AntNet.resize() whenever the window is resized
$(window).resize(function() {
  AntNet.resize();
});