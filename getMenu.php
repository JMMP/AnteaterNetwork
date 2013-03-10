<?php

/*
 * Anteater Network v14.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

require("../../secure.php");

// Enable debug functions if the flag is set
if (isset($_GET["debug"])) {
  $debug = true;
  require_once("PhpConsole.php");
  PhpConsole::start();
} else
  $debug = false;


$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error($mysqli);
}

// Check for menu flag and match it against regular expressions
if (isset($_GET["menu"]) && preg_match("%[a-zA-Z]*%", $_GET["menu"])) {
  global $column;
  // Set the database column name depending on what menu we want
  $filter = $_GET["menu"];
  if ($filter == "city")
    $column = "Business_City";
  if ($filter == "zipcode")
    $column = "Business_Zipcode";
  if ($filter == "state")
    $column = "Business_State";
  if ($filter == "year")
    $column = "Class_Year";
  if ($filter == "school")
    $column = "School_Name";
  if ($filter == "category")
    $column = "Business_Category";
}

// Only get unique values
$query = "SELECT DISTINCT `" . $column . "` FROM `" . $table . "` ORDER BY `" . $column . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error($mysqli));
}

$output = "<option value=''>" . ucfirst($filter) . "</option>";

// Iterate through results and create list for menu
while ($row = mysqli_fetch_array($result)) {
  $output .= "<option value='" . $row[$column] ."'>" . $row[$column] . "</option>";
}

echo $output;

mysqli_close($mysqli);
?>