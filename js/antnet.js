/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
 */

AntNet = {
  alumni: null,
  categories: null,
  schools: null,
  sizes: null,
  filters: null,
  infowindow: null,
  map: null,
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
  markers: null,
  markerClusterer: null,
  markerImageBusiness: "img/marker_anteater.png",
  markerImageUser: "img/marker_person.png",


  // FUNCTION init()
  // Initializes Anteater Network, variables, and Google Maps
  init: function() {
    this.map = new google.maps.Map(document.getElementById("js-map"), this.mapOptions);
    this.infowindow = new google.maps.InfoWindow();
    this.markers = [];
    this.filters = {
      category: "",
      school: "",
      search: ""
    }
    this.getData();
    $("#js-filter-search").keypress(function(event) {
      if (event.which == 13)
        event.preventDefault();
    });
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
      that.addBusinesses();
    });
  },

  // FUNCTION setMenus()
  // Populates the select menus
  setMenus: function() {
    $("#js-filter-category").append(this.createMenu(this.categories, "Business_Category"));
    $("#js-filter-category").trigger("chosen:updated");
    $("#js-filter-category").change(function(e, p) {
      filters.category = $("#js-filter-category").val();
    });
    $("#js-filter-school").append(this.createMenu(this.schools, "School_Name"));
    $("#js-filter-school").trigger("chosen:updated");
    $("#js-filter-school").change(function(e, p) {
      filters.school = $("#js-filter-school").val();
    });
  },

  createMenu: function(data, field) {
    var fragment = document.createDocumentFragment();
    for (var i in data) {
      var menuOption = document.createElement("option");
      menuOption.appendChild(document.createTextNode(data[i][field]));
      fragment.appendChild(menuOption);
    }
    return fragment;
  },
  
  // FUNCTION addBusinesses()
  // Sorts and filters alumni data and calls helper functions to create
  // results list and markers for those businesses
  addBusinesses: function() {
    this.clearBusinesses();
    var that = this;
    var sortedAlumni = jlinq.from(that.alumni).sort("Business_Name").select();
    if (jlinq.from(sortedAlumni).count() > 0) {
      $("#js-results-error").hide();
      for (var alumnus in sortedAlumni)
        that.addBusiness(sortedAlumni[alumnus]);
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
    this.markers[alumnus.id] = marker;

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

  // FUNCTION clearBusinesses()
  // Clears the results list and map, and show the No Results notice
  clearBusinesses: function() {
    $("#js-results-list").children(":gt(0)").remove();
    $("#js-results-error").show();
  }
};

// When DOM is loaded, initialize system and enable Google Maps visual refresh
$(document).ready(function() {
  AntNet.init();
  google.maps.visualRefresh = true;
});

// Call AntNet.resize() whenever the window is resized
$(window).resize(function() {
  AntNet.resize();
})