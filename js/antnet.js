/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://melvin.io/AnteaterNetwork
 */

AntNet = function () {

  /*
   * Comment
   */

  google.maps.visualRefresh = true;
  var mapStyles = [{
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
    }];


  return {
    init: function() {
      var gmap = new google.maps.Map(document.getElementById("js-map"), {
        center: new google.maps.LatLng(33.646259, -117.842056),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 15,
        panControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          style: google.maps.ZoomControlStyle.LARGE
        },
        styles: mapStyles
      });
    }
  };
}();

$(document).ready(function() {
  $(".js-select").chosen();
  AntNet.init();
});