<?php

require("ANConnect.php");

// Start XML file, create parent node

$dom = new DOMDocument("1.0");
$node = $dom->createElement("alumni");
$parnode = $dom->appendChild($node);

// Opens a connection to a MySQL server

$connection=mysql_connect ($ip, $username, $password);
if (!$connection) {  die('Not connected : ' . mysql_error());}

// Set the active MySQL database

$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
  die ('Can\'t use db : ' . mysql_error());
}

// Select all the rows in the markers table
//$query = "SELECT * FROM AN_Alumni";
$query = "SELECT * FROM AN_Alumni WHERE Business_City LIKE '" . $_GET["Business_City"] . "'";
$result = mysql_query($query);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}

header("Content-type: text/xml");

// Iterate through the rows, adding XML nodes for each

while ($row = @mysql_fetch_assoc($result)){
  // ADD TO XML DOCUMENT NODE
  $node = $dom->createElement("alumnus");
  $newnode = $parnode->appendChild($node);
  $newnode->setAttribute("ID_Number",$row['ID_Number']);
  $newnode->setAttribute("Last_Name",$row['Last_Name']);
  $newnode->setAttribute("First_Name", $row['First_Name']);
  $newnode->setAttribute("Class_Year", $row['Class_Year']);
  $newnode->setAttribute("School_Code", $row['School_Code']);
  $newnode->setAttribute("Business_Title", $row['Business_Title']);
  $newnode->setAttribute("Business_Name", $row['Business_Name']);
  $newnode->setAttribute("Business_Street1", $row['Business_Street1']);
  $newnode->setAttribute("Business_Street2", $row['Business_Street2']);
  $newnode->setAttribute("Business_City", $row['Business_City']);
  $newnode->setAttribute("Business_State", $row['Business_State']);
  $newnode->setAttribute("Business_Zipcode", $row['Business_Zipcode']);
  $newnode->setAttribute("Business_Phone", $row['Business_Phone']);
  $newnode->setAttribute("Business_Phone_Ext", $row['Business_Phone_Ext']); 
  $newnode->setAttribute("Business_Lat", $row['Business_Lat']);
  $newnode->setAttribute("Business_Lng", $row['Business_Lng']);
}

echo $dom->saveXML();

?>