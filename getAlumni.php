<?php

/*
 * Anteater Network v13.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

require("../../secure.php");

if (isset($_GET["debug"])) {
  $debug = true;
  require_once("PhpConsole.php");
  PhpConsole::start();
} else
  $debug = false;

// Start XML file, create parent node
$xmlDoc = new DOMDocument("1.0");
$node = $xmlDoc->createElement("alumni");
$parnode = $xmlDoc->appendChild($node);

// Opens a connection to a MySQL server
$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error($mysqli);
}

// Select all the rows in the markers table
$query = "SELECT * FROM `" . $table . "`";
$request = "";

if (isset($_GET["filters"])) {
  global $result;
  if (isset($_GET["search"]) && preg_match("%[a-zA-Z0-9\+\*\-\.\, ]*%", $_GET["search"])) {
    // Get columns indexed by FULLTEXT
    $query = "SELECT GROUP_CONCAT( DISTINCT column_name ) FROM information_schema.STATISTICS WHERE table_schema = '" . $database . "' AND table_name = '" . $table . "' AND index_type =  'FULLTEXT'";
    if ($debug)
      echo "<p>Column Query: " . $query . "</p>";
    $result = mysqli_fetch_assoc(mysqli_query($mysqli, $query));
    $columns = $result["GROUP_CONCAT( DISTINCT column_name )"];
    $query = "SELECT * FROM `" . $table . "` WHERE ";
    $request = "MATCH(" . $columns . ") AGAINST ('" . mysqli_escape_string($mysqli, $_GET["search"]) . "' IN BOOLEAN MODE)";
  } else {
    if (isset($_GET["city"]) && preg_match("%[a-zA-Z ]*%", $_GET["city"])) {
      $request .= "`Business_City` = '" . $_GET["city"] . "'";
    }
    if (isset($_GET["name"]) && preg_match("%[a-zA-Z ]*%", $_GET["name"])) {
      if ($request !== "")
        $request .= " AND ";
      $request .= "`Business_Name` LIKE '%" . mysqli_escape_string($mysqli, $_GET["name"]) . "%'";
    }
    if (isset($_GET["zipcode"]) && preg_match("%[\d\-]*%", $_GET["zipcode"])) {
      if ($request !== "")
        $request .= " AND ";
      $request .= "`Business_Zipcode` LIKE '" . $_GET["zipcode"] . "%'";
    }
    if (isset($_GET["major"]) && preg_match("%[a-zA-Z ]*%", $_GET["major"])) {
      if ($request !== "")
        $request .= " AND ";
      $request .= "`School_Code` = '" . $_GET["major"] . "'";
    }
    if (isset($_GET["year"]) && is_numeric($_GET["year"])) {
      if ($request !== "")
        $request .= " AND ";
      $request .= "`Class_Year` = '" . $_GET["year"] . "'";
    }
    if ($request != "")
      $query .= " WHERE ";
    $request .= " ORDER BY `Business_Name`";
  }
  $result = mysqli_query($mysqli, $query . $request); 
}

if ($debug)
  echo "<p>Results Query: " . $query . $request . "</p>";

if (!$result) {
  die("Invalid query: " . mysqli_error($mysqli));
}

if (!$debug) {
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
}
mysqli_close($mysqli);
?>