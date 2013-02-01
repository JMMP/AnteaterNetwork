<?php
require ("getAlumni.php");
echo($connection);

?>
if ($connection) {
  echo "Test 1: Connection successful.";
} else {
  echo "Test 1: Connection failed.";
}
?>