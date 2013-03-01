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
} else {
  $debug = false;
}

// Hierarchical tree mapping for the category codes to the full category names
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

// Mapping for the school codes to full school names
$schools = array(
  "BIO" => "Biological Sciences",
  "COMP" => "Comparitve Culture",
  "EDUC" => "Education",
  "ENG" => "Engineering",
  "FINE" => "Arts",
  "GSM" => "Business",
  "HUM" => "Humanities",
  "ICS" => "Information & Computer Sciences",
  "MED" => "Medicine",
  "PHYS" => "Physical Sciences",
  "SOC" => "Social Sciences",
  "SOEC" => "Social Ecology"
);

$mysqli = mysqli_connect($ip, $username, $password, $database);
if (mysqli_connect_errno($mysqli)) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error($mysqli);
}

// Check for menu flag and match the value against regular expressions
if (isset($_GET["menu"]) && preg_match("%[a-zA-Z]*%", $_GET["menu"])) {
  global $query;
  $filter = $_GET["menu"];
  // Build SQL query
  $query = "SELECT DISTINCT ";
  if ($filter === "category") {
    // Get the two category columns that we need
    $query .= "`Business_Category`, `Business_Category_Code`";
  } else if ($filter === "school") {
    // Set column for school code
    $query .= "`School_Name`, `School_Code`";
  }
  $query .= " FROM `" . $table . "`";


  $result = mysqli_query($mysqli, $query);

  if (!$result) {
    die("Invalid query (" . $query . "): " . mysqli_error($mysqli));
  }

  if ($filter === "category") {
    // Convert category codes to full category names
    $count = 0;
    while ($row = mysqli_fetch_array($result)) {
      global $cat, $catCode;
      if ($debug)
        var_dump($row);

      // Store the retrieved full category name
      $cat = $row["Business_Category"];
      // Store the retrieved category code
      $catCode = $row["Business_Category_Code"];

      // Only convert the category code if there is no category already
      if (is_null($cat) || $cat === "") {
        if (is_null($catCode) || $catCode === "" || $catCode === " ") {
          // If the business does not have a category code,
          // set it to "Other"
          $count++;
          $cat = "Other";
        } else if ($catCode === "RES") {
          // If the business' category code is "RES",
          // set it to "Research"
          $count++;
          $cat = "Research";
        } else {
          // Otherwise, find the category name according to our mapping
          $count++;
          $catCodeAdjusted = $catCode;

          // Change the code to 4 digits
          if (strlen($catCodeAdjusted) < 4) {
            $catCodeAdjusted *= pow(10, 4 - strlen($catCodeAdjusted));
          }

          // Get the category from the mapping
          $cat = getCategory($catCodeAdjusted, $categories, 0);
        }

        if (is_null($catCode)) {
          // Send a different SQL query for categories that are NULL
          $updateQuery = "UPDATE `" . $table . "` SET `Business_Category` = '" . $cat . "' WHERE `Business_Category_Code` IS NULL";
        } else {
          $updateQuery = "UPDATE `" . $table . "` SET `Business_Category` = '" . $cat . "' WHERE `Business_Category_Code` = '" . $catCode . "'";
        }

        if ($debug) {
          echo "<p>Code: " . $catCode . " Category: " . $cat . "</p>";
          echo "<p>Query: " . $updateQuery . "</p>";
        }
        mysqli_query($mysqli, $updateQuery);
      }
    }
    echo "<p>Set " . $count . " categories!</p>";
  } else if ($filter === "school") {
    $count = 0;
    // Convert the school codes to their full names according to the mapping above
    while ($row = mysqli_fetch_array($result)) {
      $school = $row["School_Name"];
      $schoolCode = $row["School_Code"];

      // Only convert school code if there is no school name already
      if (is_null($school) || $school === "") {
        // Check if the code exists in our mapping
        // If it doesn't, just display the code
        if (array_key_exists($schoolCode, $schools)) {
          $count++;
          $school = $schools[$schoolCode];
        }

        // Update database with converted value
        $updateQuery = "UPDATE `" . $table . "` SET `School_Name` = '" . $school . "' WHERE `School_Code` = '" . $schoolCode . "'";

        if ($debug) {
          echo "<p>Code: " . $schoolCode . " School: " . $school . "</p>";
          echo "<p>Query: " . $updateQuery . "</p>";
        }
        mysqli_query($mysqli, $updateQuery);
      }
    }
    echo "<p>Set " . $count . " schools!</p>";
  }
}
mysqli_close($mysqli);

function getCategory($cat, $cats, $depth) {
  // $cat is the category code
  // $cats is the category code mapping array
  // $depth is the current level in mapping array we are at
  // $label is the full category name string
  global $debug, $label;

  // Cut the category code to the length we need
  // using the incremented depth
  $id = intval(substr($cat, 0, ++$depth));
  if ($debug) {
    echo "<p>Category: " . $cat . " ";
    echo "Truncated ID: " . $id . " ";
    echo "Depth: " . $depth . "</p>";
  }

  // Traverse through the top level of the category code
  // tree until we find an ID that matches our category code
  foreach ($cats as $array) {
    if ($id == $array["id"]) {
      // We found the branch with an ID that matches our current category code
      if ($debug) {
        echo "<p>Array ID Match: " . $array["id"] . " Label Match: " . $array["label"] . "</p>";
      }

      // Store the label of this match, just in case
      // we don't find any more matches later
      $label = $array["label"];

      if ($array["children"] == null) {
        // If the "branch" does not have any children, we are done
        // and can return the label
        if ($debug) {
          echo "<p>No children left.</p>";
        }
        return $label;
      } else {
        // If the branch has more children, we need to continue
        // traversing down the tree
        if ($debug) {
          echo "<p>Continuing on with array: ";
          echo "</p>";
        }

        // Call this function again passing it the new children array
        return getCategory($cat, $array["children"], $depth);
      }
    }
  }

  if ($debug) {
    echo "<p>Could not find match.</p>";
  }

  // If we could not find any matches, we can return our last stored (matched) label
  return $label;
}

?>