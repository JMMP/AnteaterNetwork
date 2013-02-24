<?php

/*
 * Anteater Network v13.2
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

// Mapping for the school codes to full school names
$schools = array(
  "BIO"  => "Biological Sciences",
  "COMP" => "Comparitve Culture",
  "EDUC" => "Education",
  "ENG"  => "Engineering",
  "FINE" => "Arts",
  "GSM"  => "Business",
  "HUM"  => "Humanities",
  "ICS"  => "Information & Computer Sciences",
  "MED"  => "Medicine",
  "PHYS" => "Physical Sciences",
  "SOC"  => "Social Sciences",
  "SOEC" => "Social Ecology"
  );

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
    $column = "School_Code";
  if ($filter == "category")
    $column = "Business_Category";
}

// Only get unique values
$query = "SELECT DISTINCT `" . $column . "` FROM `" . $table . "` ORDER BY `" . $column . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error($mysqli));
}

// If we are making the school menu, convert the codes
// to their full names according to the mapping
if ($filter == "school") {
  while ($row = mysqli_fetch_array($result)) {
    // Check if the code exists in our mapping
    // If it doesn't, just display the code
    if (array_key_exists($row[$column], $schools))
      $tag = $schools[$row[$column]];
    else
      $tag = $row[$column];
    echo "<li><a onclick=\"populate(" . "'" . $filter . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $tag . "</span></a></li>";
  }
} else {
  while ($row = mysqli_fetch_array($result)) {
    echo "<li><a onclick=\"populate(" . "'" . $filter . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $row[$column] . "</span></a></li>";
  }
}

mysqli_close($mysqli);
?>