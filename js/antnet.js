/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
 */

AntNet = {

  alumni: null,
  categories: null,
  schools: null,
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
  
  /*
   *
   * Functions
   *
   */

  init: function() {
    this.map = new google.maps.Map(document.getElementById("js-map"), this.mapOptions);
    this.infowindow = new google.maps.InfoWindow();
    this.markers = [];
    this.getData();
    $(".js-select").chosen();
    $("#js-filter-search").keypress(function(event) {
      if (event.which == 13)
        event.preventDefault();
    });
    this.resize();
    
  },

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
    else
      $("#js-map").height(hMax);
    */
  },

  getData: function() {
    var that = this;
    $.getJSON("antnet_get.php?antnet")
    .fail(function() { console.log("getData error"); })
    .done(function(data) {
      that.alumni = data.alumni;
      that.categories = data.categories;
      that.schools = data.schools;
      that.createMarkers();
    });
  },

  clearResults: function() {
    $("#js-results-list").children(":gt(0)").remove();
    $("#js-results-error").hide();
  },

  createMarkers: function() {
    this.clearResults();
    var that = this;
    var sortedAlumni = jlinq.from(that.alumni).sort("Business_Name").select();
    $.each(sortedAlumni, function(i, alumnus) {
      that.addBusiness(alumnus);
    });
  },

  addBusiness: function(alumnus) {
    var marker = new google.maps.Marker({
      map: this.map,
      position: new google.maps.LatLng(alumnus.Business_Lat, alumnus.Business_Lng),
      title: alumnus.Business_Name,
      icon: this.markerImageBusiness
    });

    this.markers[alumnus.id] = marker;

    var infowindowContent = alumnus.First_Name + " " + alumnus.Last_Name;
    var infowindowHTML = '<div class="js-infowindow">' + infowindowContent + '</div>';

    var that = this;
    google.maps.event.addListener(marker, "click", function() {
      that.infowindow.setContent(infowindowHTML);
      that.infowindow.open(that.map, marker);
    });

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
    
    $(resultLI).click(function() {
      $("#js-results-list").children("li").removeClass("active");
      $(this).addClass("active");
      google.maps.event.trigger(marker, "click");
    });

  }


};

$(document).ready(function() {
  AntNet.init();
  google.maps.visualRefresh = true;
});

$(window).resize(function() {
  AntNet.resize();
})