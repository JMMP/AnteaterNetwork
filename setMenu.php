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
} else {
  $debug = false;
}

$categories = array(
    array(
        "id" => 0,
        "label" => "Trade & Natural Resources",
        "children" => null
    ),
    array(
        "id" => 1,
        "label" => "Trade & Natural Resources",
        "children" => array(
            array(
                "id" => 15,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 16,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 17,
                "label" => "Professional Services",
                "children" => null
            )
        )
    ),
    array(
        "id" => 2,
        "label" => "Manufacturing & Utilities",
        "children" => array()),
    array(
        "id" => 3,
        "label" => "Manufacturing & Utilities",
        "children" => array()),
    array(
        "id" => 4,
        "label" => "Manufacturing & Utilities",
        "children" => array()),
    array(
        "id" => 5,
        "label" => "Trade & Natural Resources",
        "children" => array(
            array(
                "id" => 52,
                "label" => "Shopping & Retail",
                "children" => null
            ),
            array(
                "id" => 53,
                "label" => "Shopping & Retail",
                "children" => null
            ),
            array(
                "id" => 54,
                "label" => "Dining",
                "children" => null
            ),
            array(
                "id" => 55,
                "label" => "Shopping & Retail",
                "children" => null
            ),
            array(
                "id" => 56,
                "label" => "Shopping & Retail",
                "children" => null
            ),
            array(
                "id" => 57,
                "label" => "Shopping & Retail",
                "children" => null
            ),
            array(
                "id" => 58,
                "label" => "Dining",
                "children" => null
            ),
            array(
                "id" => 59,
                "label" => "Shopping & Retail",
                "children" => null
            )
        )
    ),
    array(
        "id" => 6,
        "label" => "Financial Services",
        "children" => array()),
    array(
        "id" => 7,
        "label" => "Entertainment & Recreation",
        "children" => array(
            array(
                "id" => 72,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 73,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 75,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 76,
                "label" => "Professional Services",
                "children" => null
            )
        )
    ),
    array(
        "id" => 8,
        "label" => "Health & Public Services",
        "children" => array(
            array(
                "id" => 81,
                "label" => "Professional Services",
                "children" => null
            ),
            array(
                "id" => 82,
                "label" => "Education",
                "children" => null
            ),
            array(
                "id" => 84,
                "label" => "Entertainment & Recreation",
                "children" => null
            ),
            array(
                "id" => 86,
                "label" => "Entertainment & Recreation",
                "children" => null
            ),
            array(
                "id" => 87,
                "label" => "Professional Services",
                "children" => array(
                    array(
                        "id" => 872,
                        "label" => "Financial Services",
                        "children" => null
                    ),
                    array(
                        "id" => 873,
                        "label" => "Science & Technology",
                        "children" => null
                    )
                )
            ),
            array(
                "id" => 88,
                "label" => "Other",
                "children" => null
            ),
            array(
                "id" => 89,
                "label" => "Other",
                "children" => null
            )
        )
    ),
    array(
        "id" => 9,
        "label" => "Health & Public Services",
        "children" => null
    )
);

$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error($mysqli);
}

if (isset($_GET["menu"]) && preg_match("%[a-zA-Z]*%", $_GET["menu"])) {
  global $column, $query;
  $filter = $_GET["menu"];
  if ($filter == "category") {
    $query = "SELECT DISTINCT `Business_Category`, `Business_Category_Code` FROM `" . $table . "`";
  }
}

if (!is_null($column)) {
  $query = "SELECT DISTINCT `" . $column . "` FROM `" . $table . "`";
}
$result = mysqli_query($mysqli, $query);

if (!$result) {
  die("Invalid query (" . $query . "): " . mysqli_error($mysqli));
}

if ($filter == "category") {
  $count = 0;
  while ($row = mysqli_fetch_array($result)) {
    global $cat, $catCode;
    $cat = $row["Business_Category"];
    $catCode = $row["Business_Category_Code"];
    if (is_null($cat) || $cat == "") {
      if (!is_null($catCode) && $catCode != "" && $catCode != " ") {
        if ($catCode == "RES") {
          $count++;
          $cat = "Research";
        } else {
          $count++;
          $catCodeAdjusted = $catCode;
          if (strlen($catCodeAdjusted) < 4) {
            $catCodeAdjusted *= pow(10, 4 - strlen($catCodeAdjusted));
          }
          $cat = getCategory($catCodeAdjusted, $categories, 0);
        }
        $updateQuery = "UPDATE `" . $table . "` SET `Business_Category` = '" . $cat . "' WHERE `Business_Category_Code` = '" . $catCode . "'";
        if ($debug) {
          echo "<p>Code: " . $catCode . " Category: " . $cat . "</p>";
          echo "<p>Query: " . $updateQuery . "</p>";
        }
        mysqli_query($mysqli, $updateQuery);
      }
    }
  }
  echo "<p>Set " . $count . " categories!</p>";
}


mysqli_close($mysqli);

function getCategory($cat, $cats, $depth) {
  global $debug, $label;
  $id = intval(substr($cat, 0, ++$depth));
  if ($debug) {
    //var_dump($cats);
    echo "<p>Category: " . $cat . " ";
    echo "Truncated ID: " . $id . " ";
    echo "Depth: " . $depth . "</p>";
  }
  foreach ($cats as $array) {
    if ($debug) {
      //var_dump($array);
    }
    if ($id == $array["id"]) {
      if ($debug) {
        echo "<p>Array ID Match: " . $array["id"] . " Label Match: " . $array["label"] . "</p>";
      }
      $label = $array["label"];
      if ($array["children"] == null) {
        if ($debug) {
          echo "<p>No children left.</p>";
        }
        return $label;
      } else {
        if ($debug) {
          echo "<p>Continuing on with array: ";
          //var_dump($array);
          echo "</p>";
        }
        return getCategory($cat, $array["children"], $depth);
      }
    }
  }
  if ($debug) {
    echo "<p>Could not find match.</p>";
  }
  return $label;
}

?>