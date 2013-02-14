<?php

/*
 * Anteater Network v13.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

require("../../secure.php");

$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (isset($_GET["menu"]) && preg_match("*[a-zA-Z]*", $_GET["menu"])) {
  $filter = $_GET["menu"];
  if ($filter == "city")
    $column = "Business_City";
  if ($filter == "zipcode")
    $column = "Business_Zipcode";
  if ($filter == "state")
    $column = "Business_State";
  if ($filter == "year")
    $column = "Class_Year";
  if ($filter == "major")
    $column = "School_Code";
}

$query = "SELECT DISTINCT `" . $column . "` FROM " . $table . " ORDER BY `" . $column . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error());
}

while ($row = mysqli_fetch_array($result)) {
  echo "<li><a onclick=\"populate(" . "'" . $filter . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $row[$column] . "</span></a></li>";
}

mysqli_close($mysqli);
?>