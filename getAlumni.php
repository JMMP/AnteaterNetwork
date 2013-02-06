<?php

require("../../secure.php");

// Start XML file, create parent node
$xmlDoc = new DOMDocument("1.0");
$node = $xmlDoc->createElement("alumni");
$parnode = $xmlDoc->appendChild($node);

// Opens a connection to a MySQL server
$connection = mysql_connect($ip, $username, $password);
if (!$connection) {
   die("Not connected : " . mysql_error());
}

// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
   die("Can\'t use db : " . mysql_error());
}

// Select all the rows in the markers table
$selectQuery = "SELECT * FROM `AntNet_Alumni`";
$selectRequest = "";

if (!empty($_GET) && !isset($_GET["geocode"])) {
   $selectQuery .= " WHERE ";
   if (isset($_GET["city"])) {
      if ($selectRequest != "")
         $selectRequest .= " AND ";
      $selectRequest .= "`Business_City` = '" . $_GET["city"] . "'";
   }
   if (isset($_GET["name"])) {
      if ($selectRequest != "")
         $selectRequest .= " AND ";
      $selectRequest .= "`Business_Name` LIKE '" . $_GET["name"] . "%'";
   }
   if (isset($_GET["zipcode"])) {
      if ($selectRequest != "")
         $selectRequest .= " AND ";
      $selectRequest .= "`Business_Zipcode` = '" . $_GET["zipcode"] . "'";
   }
}

$selectRequest .= " ORDER BY `Business_Name`";

$selectResult = mysql_query($selectQuery . $selectRequest);

if (!$selectResult) {
   die("Invalid query: " . mysql_error());
}

// Geocoding
if ($_GET["geocode"] == "true") {
   while ($row = @mysql_fetch_assoc($selectResult)) {
      if (is_null($row["Business_Lat"]) || $row["Business_Lat"] !== 0) {
         $id = $row["ID_Number"];

         // Build address
         $address = $row["Business_Street1"];
         if ($row["Business_City"] != "")
            $address .= ", " . $row["Business_City"];
         if ($row["Business_State"] != "")
            $address .= ", " . $row["Business_State"];
         if ($row["Business_Zipcode"] != "")
            $address .= ", " . $row["Business_Zipcode"];
         if ($row["Business_Country"] != "")
            $address .= ", " . $row["Business_Country"];

         // Geocode
         $address = urlencode($address);
         $geocodeURL = "http://maps.googleapis.com/maps/api/geocode/json?address=" . $address . "&sensor=false";
         $geocodeResult = utf8_encode(file_get_contents($geocodeURL));
         $geocodeResult = json_decode($geocodeResult, true);
         $status = $geocodeResult["status"];
         $location = $geocodeResult["results"][0]["geometry"]["location"];
         if ($status == "OK") {
            $lat = $location["lat"];
            $lng = $location["lng"];
         } else if ($status == "ZERO_RESULTS") {
            echo $geocodeURL;
            $lat = 0;
            $lng = 0;
         } else {
            die("Geocode was not successful for the following reason: " . $status);
         }
         $updateQuery = "UPDATE `AntNet_Alumni` SET `Business_Lat` = " . $lat . ", `Business_Lng` = " . $lng . " WHERE `ID_Number` = " . $id;
         mysql_query($updateQuery);         
      }
   }
   echo "All addresses geocoded!";
}

$selectResult = mysql_query($selectQuery . $selectRequest);

if (!$selectResult) {
   die("Invalid query: " . mysql_error());
}

// Iterate through the rows, adding XML nodes for each
header("Content-type: text/xml");
while ($row = @mysql_fetch_assoc($selectResult)) {
   // Add to XML document node
   $node = $xmlDoc->createElement("alumnus");
   $newnode = $parnode->appendChild($node);
   $newnode->setAttribute("ID_Number", $row["ID_Number"]);
   $newnode->setAttribute("Last_Name", $row["Last_Name"]);
   $newnode->setAttribute("First_Name", $row["First_Name"]);
   $newnode->setAttribute("Class_Year", $row["Class_Year"]);
   $newnode->setAttribute("School_Code", $row["School_Code"]);
   $newnode->setAttribute("Business_Title", $row["Business_Title"]);
   $newnode->setAttribute("Business_Name", $row["Business_Name"]);
   $newnode->setAttribute("Business_Field", $row["Business_Field"]);
   $newnode->setAttribute("Business_Category", $row["Business_Category"]);
   $newnode->setAttribute("Business_Street1", $row["Business_Street1"]);
   $newnode->setAttribute("Business_Street2", $row["Business_Street2"]);
   $newnode->setAttribute("Business_City", $row["Business_City"]);
   $newnode->setAttribute("Business_State", $row["Business_State"]);
   $newnode->setAttribute("Business_Zipcode", $row["Business_Zipcode"]);
   $newnode->setAttribute("Business_Country", $row["Business_Country"]);
   $newnode->setAttribute("Business_Phone", $row["Business_Phone"]);
   $newnode->setAttribute("Business_Phone_Ext", $row["Business_Phone_Ext"]);
   $newnode->setAttribute("Business_Lat", $row["Business_Lat"]);
   $newnode->setAttribute("Business_Lng", $row["Business_Lng"]);
}

echo $xmlDoc->saveXML();


mysql_close($connection);
?>