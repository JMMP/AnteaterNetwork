<?php
require ("getAlumni.php?debug=true");
echo "Test";
if ($connection) {
  echo "Test 1: Connection successful.";
} else {
  echo "Test 1: Connection failed.";
}
?>