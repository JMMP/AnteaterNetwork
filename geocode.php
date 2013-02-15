<?php
/*
 * Anteater Network v13.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

$debug = true;

require("../../secure.php");

// Opens a connection to a MySQL server
$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
 echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Send query to database
$query = "SELECT * FROM `" . $table . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
   die("Invalid query: " . mysqli_error());
}

// Set timeout in seconds for script depending on total number of entries in database
// Takes into account default PHP max_execution_time of 30 seconds
$count = 0;
$timeout = 5;
set_time_limit(mysqli_num_fields($result) / $timeout);

// Geocoding
while ($row = mysqli_fetch_assoc($result)) {
   if (is_null($row["Business_Lat"])) {
      $id = $row["ID_Number"];

      // Build address
      $address = $row["Business_Street1"];
      if (!is_null($row["Business_City"]) || $row["Business_City"] != "")
         $address .= ", " . $row["Business_City"];
      if (!is_null($row["Business_State"]) || $row["Business_State"] != "")
         $address .= ", " . $row["Business_State"];
      if (!is_null($row["Business_Country"]) || $row["Business_Country"] != "")
         $address .= ", " . $row["Business_Country"];
      if (!is_null($row["Business_Zipcode"]) || $row["Business_Zipcode"] != "")
         $address .= ", " . $row["Business_Zipcode"];

      // Geocode
      $url = "http://maps.googleapis.com/maps/api/geocode/json?address=" . urlencode($address) . "&sensor=false";
      $geocoded = utf8_encode(file_get_contents($url));
      $geocoded = json_decode($geocoded, true);
      $status = $geocoded["status"];
      $location = $geocoded["results"][0]["geometry"]["location"];
      if ($status == "OK") {
         if ($debug)
            echo "<p>" . $row["Business_Name"] . "...OK</p>";
         $lat = $location["lat"];
         $lng = $location["lng"];
      } else if ($status == "ZERO_RESULTS") {
         // If geocode returned no results, set latitude and longitude to 0
         // Don't need to re-geocode these businesses next time
         if ($debug)
            echo "<p>" . $row["Business_Name"] . "...FAILED (Address: " . $address . ", URL: " . $url . ")</p>";
         $lat = 0;
         $lng = 0;
      } else {
         die("<p>Geocoded " . $count . " addresses. Geocode was not successful: " . $status . "</p>");
      }
      $updateQuery = "UPDATE `" . $table . "` SET `Business_Lat` = " . $lat . ", `Business_Lng` = " . $lng . " WHERE `ID_Number` = " . $id;
      mysqli_query($mysqli, $updateQuery);
      $count++;

      // Sleep loop to prevent going over Google Maps API query limit
      if ($count % $timeout == 0)
         sleep(1);
   }
}

if ($debug)
   echo "<p>Gecoded " . $count . " addresses!</p>";
mysqli_close($mysqli);
?>