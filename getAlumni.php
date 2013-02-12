<?php
/*
 * Anteater Network v12.2
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

require("../../secure.php");

// Start XML file, create parent node
$xmlDoc = new DOMDocument("1.0");
$node = $xmlDoc->createElement("alumni");
$parnode = $xmlDoc->appendChild($node);

// Opens a connection to a MySQL server
$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// Select all the rows in the markers table
$query = "SELECT * FROM " . $table;
$request = "";

if (!empty($_GET) && !isset($_GET["geocode"])) {
   $query .= " WHERE ";
   if (isset($_GET["city"])) {
      if ($request != "")
         $request .= " AND ";
      $request .= "`Business_City` = '" . $_GET["city"] . "'";
   }
   if (isset($_GET["name"])) {
      if ($request != "")
         $request .= " AND ";
      $request .= "`Business_Name` LIKE '%" . mysqli_escape_string($mysqli, $_GET["name"]) . "%'";
   }
   if (isset($_GET["zipcode"])) {
      if ($request != "")
         $request .= " AND ";
      $request .= "`Business_Zipcode` = '" . $_GET["zipcode"] . "'";
   }
   if (isset($_GET["major"])) {
      if ($request != "")
         $request .= " AND ";
      $request .= "`School_Code` = '" . $_GET["major"] . "'";
   }
   if (isset($_GET["year"])) {
      if ($request != "")
         $request .= " AND ";
      $request .= "`Class_Year` = '" . $_GET["year"] . "'";
   }
}

$request .= " ORDER BY `Business_Name`";

$result = mysqli_query($mysqli, $query . $request);

if (!$result) {
   die("Invalid query: " . mysqli_error());
}


// Iterate through the rows, adding XML nodes for each
header("Content-type:text/xml");
while ($row = mysqli_fetch_assoc($result)) {
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

mysqli_close($mysqli);
?>