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
    this.markers = [];
    this.infowindow = new google.maps.InfoWindow();
    this.getData();
    
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

  createMarkers: function() {
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

    var infowindowContent = document.createElement("div");
    infowindowContent.className = "js-map-infowindow";
    infowindowContent.innerHTML = alumnus.First_Name + alumnus.Last_Name;

    var that = this;
    google.maps.event.addListener(marker, "click", function() {
      that.infowindow.setContent(infowindowContent);
      that.infowindow.open(that.map, marker);
    })

    this.markers[alumnus.id] = marker;
  }


};

$(document).ready(function() {
  $(".js-select").chosen();
  AntNet.init();
  google.maps.visualRefresh = true;
  $("#js-filter-search").keypress(function(event) {
    if (event.which == 13)
      event.preventDefault();
  });
});