/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network/
 */

AntNet = {

  map: null,
  mapCenter: {
    "lat": 33.646259,
    "lng": -117.842056,
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
    center: new google.maps.LatLng(this.mapCenter.lat, this.mapCenter.lng),
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
  

  init: function() {
    this.map = new google.maps.Map(document.getElementById("js-map"), mapOptions);
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