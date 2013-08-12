<?php
session_start();

/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
*/

if (isset($_GET["antnet"])) {
  require_once("../../antnet_secure.php");

// Execute query to select all rows
  $result = mysqli_query($mysqli, "SELECT * FROM `" . $table . "` ORDER BY `Business_Name`");

  if (!$result) {
    if ($debug)
      echo "Query failed: " . mysqli_error($mysqli);
    die();
  }

  $businesses = array();

  while ($row = mysqli_fetch_assoc($result)) {
    $businesses[] = $row;
  }

  echo json_encode($businesses);
  mysqli_close($mysqli);
}
?>