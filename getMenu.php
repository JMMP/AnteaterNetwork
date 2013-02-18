<?php

/*
 * Anteater Network v13.0
 * http://git.io/antnet
 *
 * Copyright 2013 JMMP
 */

require_once("PhpConsole.php");
PhpConsole::start();
require("../../secure.php");

$categories = array(
  array(
    "id"       => 0,
    "label"    => "Trade & Natural Resources",
    "children" => null
    ),
  array(
    "id"       => 1,
    "label"    => "Trade & Natural Resources",
    "children" => array(
      array(
        "id"       => 15,
        "label"    => "Professional Services",
        "children" => null
        ),
      array(
        "id"       => 16,
        "label"    => "Professional Services",
        "children" => null
        ),
      array(
        "id"       => 17,
        "label"    => "Professional Services",
        "children" => null
        )
      )
    ),
  array(
    "id"       => 2,
    "label"    => "Manufacturing & Utilities",
    "children" => array()),
  array(
    "id"       => 3,
    "label"    => "Manufacturing & Utilities",
    "children" => array()),
  array(
    "id"       => 4,
    "label"    => "Manufacturing & Utilities",
    "children" => array()),
  array(
    "id"       => 5,
    "label"    => "Trade & Natural Reources",
    "children" => array(
      array(
        "id"       => 52,
        "label"    => "Shopping & Retail",
        "children" => null
        ),
      array(
        "id"       => 53,
        "label"    => "Shopping & Retail",
        "children" => null
        ),
      array(
        "id"       => 54,
        "label"    => "Dining",
        "children" => null
        ),
      array(
        "id"       => 55,
        "label"    => "Shopping & Retail",
        "children" => null
        ),
      array(
        "id"       => 56,
        "label"    => "Shopping & Retail",
        "children" => null
        ),
      array(
        "id"       => 57,
        "label"    => "Shopping & Retail",
        "children" => null
        ),
      array(
        "id"       => 58,
        "label"    => "Dining",
        "children" => null
        ),
      array(
        "id"       => 59,
        "label"    => "Shopping & Retail",
        "children" => null
        )
      )
    ),
array(
  "id"       => 6,
  "label"    => "Financial Services",
  "children" => array()),
array(
  "id"       => 7,
  "label"    => "Entertainment & Recreation",
  "children" => array(
    array(
      "id"       => 72,
      "label"    => "Professional Services",
      "children" => null
      ),
    array(
      "id"       => 73,
      "label"    => "Professional Services",
      "children" => null
      ),
    array(
      "id"       => 75,
      "label"    => "Professional Services",
      "children" => null
      ),
    array(
      "id"       => 76,
      "label"    => "Professional Services",
      "children" => null
      )
    )
  ),
array(
  "id"       => 8,
  "label"    => "Health & Public Services",
  "children" => array(
    array(
      "id"       => 81,
      "label"    => "Professional Services",
      "children" => null
      ),
    array(
      "id"       => 82,
      "label"    => "Education",
      "children" => null
      ),
    array(
      "id"       => 84,
      "label"    => "Entertainment & Recreation",
      "children" => null
      ),
    array(
      "id"       => 86,
      "label"    => "Entertainment & Recreation",
      "children" => null
      ),
    array(
      "id"       => 87,
      "label"    => "Professional Services",
      "children" => array(
        array(
          "id"       => 872,
          "label"    => "Financial Services",
          "children" => null
          ),
        array(
          "id"       => 873,
          "label"    => "Science & Technology",
          "children" => null
          )
        )
      ),
    array(
      "id"       => 88,
      "label"    => "Other",
      "children" => null
      ),
    array(
      "id"       => 89,
      "label"    => "Other",
      "children" => null
      )
    )
),
array(
  "id"       => 9,
  "label"    => "Health & Public Services",
  "children" => null
  )
);

$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if (isset($_GET["menu"]) && preg_match("%[a-zA-Z]*%", $_GET["menu"])) {
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
  if ($filter == "category")
    $column = "Business_Category";
}

$query = "SELECT DISTINCT `" . $column . "` FROM `" . $table . "` ORDER BY `" . $column . "`";
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error());
}

while ($row = mysqli_fetch_array($result)) {
  $tag = $row[$column];
  // Convert category numbers to readable strings
  if ($filter == "category") {
    $category = $row[$column];
    if ($category == "") {
      break;
    } else if ($category == "RES") {
      $tag = "Research";
    } else {
      getCategory($category, $categories);
    }
  }
  echo "<li><a onclick=\"populate(" . "'" . $filter . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $tag . "</span></a></li>";
}

mysqli_close($mysqli);

function getCategory($cat, $cats) {
  global $categories;
  if (strlen($cat) < 4)
    $cat *= pow(10, 4 - strlen($cat));
  substr($cat, 0, 1);
}
?><a onclick=\"populate(" . "'" . $filter . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $tag . "</span></a></li>";
}

mysqli_close($mysqli);
?>