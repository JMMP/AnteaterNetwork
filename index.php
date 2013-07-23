<!--
   + Anteater Network v15.0
   + Copyright 2013 JMMP and UCI Alumni Association
   + http://melvin.io/AnteaterNetwork
-->
<?php
  session_start();
  $_SESSION["ip"] = $_SERVER["REMOTE_ADDR"];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Anteater Network</title>
  <link href="css/bootstrap.css" rel="stylesheet" media="screen"/>
  <link href="css/bootstrap-responsive.css" rel="stylesheet" media="screen"/>
  <link href="css/journal.css" rel="stylesheet" media="screen"/>
  <link href="css/antnet_styles.css" rel="stylesheet" media="screen"/>
  <script src="js/jquery.min.js"></script>
  <script src="//maps.googleapis.com/maps/api/js?key=AIzaSyDjfKwuT7W5o7YSTt6wHmeDaEhgIxuOUoI&amp;sensor=true"></script>
  <script src="js/bootstrap.js"></script>
  <script src="js/gmaps.js"></script>
  <script src="js/markerclusterer.js"></script>
  <script src="js/antnet_initialize.js"></script>
</head>
<body>
</body>
</html>