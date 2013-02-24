<?php

/*
 * Anteater Network v13.2
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

if (isset($_GET["menu"]) && preg_match("%[a-zA-Z]*%", $_GET["menu"])) {
  global $column;
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

$query = "SELECT DISTINCT `" . $column . "` FROM `" . $table . "` ORDER BY `" . $column . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error($mysqli));
}

if ($filter == "school") {
  while ($row = mysqli_fetch_array($result)) {
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