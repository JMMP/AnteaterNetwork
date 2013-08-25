<?php
session_start();

/*
 + Anteater Network v15.0
 + Copyright 2013 JMMP and UCI Alumni Association
 + http://alumni.uci.edu/anteater-network
 */

 if (isset($_GET["antnet"])) {
  require_once("../../antnet_secure.php");

  // Get alumni
  $result = mysqli_query($mysqli, 
    "SELECT id, 
    Last_Name,
    First_Name,
    Class_Year,
    School_Code,
    School_Name,
    Business_Title,
    Business_Name,
    Business_Category,
    Business_Street1,
    Business_Street2,
    Business_City,
    Business_State,
    Business_Country,
    Business_Zipcode,
    Business_Phone,
    Business_Phone_Ext,
    Business_Lat,
    Business_Lng
    FROM " . $table . 
    " WHERE Business_Name != \"\" ORDER BY Business_Name");

  if (!$result) {
    if ($debug)
      echo "Alumni query failed: " . mysqli_error($mysqli);
    die();
  }

  $alumni = array();
  $numAlumni = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $alumni[] = $row;
    $numAlumni++;
  }


  // Get categories
  $result = mysqli_query($mysqli,
    "SELECT DISTINCT Business_Category 
    FROM " . $table . " ORDER BY Business_Category");

  if (!$result) {
    if ($debug)
      echo "Categories query failed: " . mysqli_error($mysqli);
    die();
  }

  $categories = array();
  $numCategories = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = $row;
    $numCategories++;
  }


  // Get schools
  $result = mysqli_query($mysqli,
    "SELECT DISTINCT School_Name 
    FROM " . $table . " ORDER BY School_Name");

  if (!$result) {
    if ($debug)
      echo "Schools query failed: " . mysqli_error($mysqli);
    die();
  }

  $schools = array();
  $numSchools = 0;
  while ($row = mysqli_fetch_assoc($result)) {
    $schools[] = $row;
    $numSchools++;
  }

  // Return all results as a JSON object
  $sizes = array(
    "alumni"     => $numAlumni,
    "categories" => $numCategories,
    "schools"    => $numSchools
    );
  $data = array(
    "alumni"     => $alumni,
    "categories" => $categories,
    "schools"    => $schools,
    "sizes"       => $sizes);

  echo json_encode($data);
  mysqli_close($mysqli);
}

?>