<?php
session_start();

/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
 */

$_SESSION["ip"] = $_SERVER["REMOTE_ADDR"];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anteater Network</title>
  <link href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/css/bootstrap.min.css" rel="stylesheet" media="screen"/>
  <link href="//netdna.bootstrapcdn.com/bootswatch/2.3.2/cerulean/bootstrap.min.css" rel="stylesheet" media="screen"/>
  <link href="css/chosen.css" rel="stylesheet" media="screen"/>
  <link href="css/antnet.css" rel="stylesheet" media="screen"/>
  <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
  <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyDjfKwuT7W5o7YSTt6wHmeDaEhgIxuOUoI&sensor=true"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.2/js/bootstrap.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/chosen/1.0/chosen.jquery.min.js"></script>
  <script src="js/markerclusterer.js"></script>
  <script src="js/antnet.js"></script>
</head>
<body>
  <div class="navbar navbar-inverse navbar-static-top" id="js-navbar">
    <div class="navbar-inner">
      <div class="container-fluid">
        <ul class="nav">
          <li>
            <a class="brand" id="antnet-logo">
              <img src="img/antnet_logo.png" alt="Anteater Network" />
            </a>
          </li>
          <li>
            <select class="js-select" id="js-filter-school" data-placeholder="School">
              <option></option>
            </select>
          </li>
          <li>
            <select class="js-select" id="js-filter-category" data-placeholder="Category">
              <option></option>
            </select>
          </li>
          <li>
            <input class="search-query pull-right" id="js-filter-search" type="text" placeholder="Search">
          </li>
        </ul>
        <ul class="nav pull-right">
          <li class="dropdown">
            <a class="dropdown-toggle" id="js-menu-desktop" data-toggle="dropdown">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <div class="nav-collapse collapse">
              </div>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a><i class="icon-user"></i> About</a>
              </li>
              <li>
                <a><i class="icon-pencil"></i> Update My Info</a>
              </li>
              <li>
                <a><i class="icon-question-sign"></i> Help</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row-fluid">
      <ul class="nav" id="js-results">
        <li class="nav-header" id="js-results-header">
          Businesses<a id="js-results-hide" class="pull-right">Hide</a>
        </li>
        <li class="alert alert-info" id="js-results-error">
          <h4 class="alert-heading">No results found!</h4>
        </li>
        <ul class="nav nav-list" id="js-results-list">          
        </ul>
      </ul>
      <!-- Bootstrap's "google-maps" class fixes distortion of map controls -->
      <div class="google-maps" id="js-map">
      </div>
    </div>
  </div>
</body>
</html>