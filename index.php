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
  <link href="css/chosen.min.css" rel="stylesheet" media="screen"/>
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
                <a href="#about" data-toggle="modal"><i class="icon-user"></i> About</a>
              </li>
              <li>
                <a href="#update" data-toggle="modal"><i class="icon-pencil"></i> Update Info</a>
              </li>
              <li>
                <a href="#help" data-toggle="modal"><i class="icon-question-sign"></i> Help</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div id="about" class="modal hide fade" tabindex="-1">
    <div class="modal-header">
      <button class="close" data-dismiss="modal">x</button>
      <h3>About</h3>
    </div>
    <div class="modal-body">
      <img src="img/antnet_logo_full.png"><br />
      <h3 class="text-center"><i>Connecting you to Anteaters</i></h3>
      <p>The <b>Anteater Network</b> connects University of California, Irvine
      alumni who have started their own businesses to past, present, and future Anteaters.
      Simply browse the map or search for the Anteater owned businesses you care about.</p>
      <p>© 2013 JMMP in association with the UC Irvine Alumni Association</p>
      <a href="mailto:jmmp@melvin.io"><img src="img/jmmp_logo.png"></a><a href="alumni.uci.edu"><img src="img/uciaa_logo.png"></a>
    </div>
    <div class="modal-footer">
      <button class="btn" data-dismiss="modal">Close</button>
    </div>
  </div>
  <div id="update" class="modal hide fade" tabindex="-1">
    <div class="modal-header">
      <button class="close" data-dismiss="modal">x</button>
      <h2>Update My Information</h2>
    </div>
    <div class="modal-body">
      <h4>Keep your business information up to date!</h4>
      <p>Help represent the University of California, Irvine and expose your business with the <b>Anteater Network</b>!</p>
      <p>To update your personal and/or business contact information with UCI,
      you can:</p>
      <ul>
        <li>Email us at <a href="mailto:alumni@uci.edu">alumni@uci.edu</a></li>
        <li>Fill in our online form <a href="/connect/update.php">here</a></li>
      </ul>
      <p>If your business switches phone numbers, moves location, gets a new website, or makes any changes to its contact information, be sure to let us know!</p>
    </div>
    <div class="modal-footer">
      <button class="btn" data-dismiss="modal">Close</button>
    </div>
  </div>
  <div id="help" class="modal hide fade" tabindex="-1">
    <div class="modal-header">
      <button class="close" data-dismiss="modal">x</button>
      <h3>Help</h3>
    </div>
    <div class="modal-body">
      <p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
      sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
      sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
    </div>
    <div class="modal-footer">
      <button class="btn" data-dismiss="modal">Close</button>
    </div>
  </div>
  <div class="container-fluid">
    <div class="row-fluid">
      <noscript>The Anteater Network requires JavaScript. Please enable JavaScript and refresh this page.</noscript>
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