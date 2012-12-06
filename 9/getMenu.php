<?php

require("secure.php");

$connection = mysql_connect($ip, $username, $password);
if (!$connection) {
    die('Not connected : ' . mysql_error());
}


// Set the active MySQL database
$db_selected = mysql_select_db($database, $connection);
if (!$db_selected) {
    die('Can\'t use db : ' . mysql_error());
}

if (!empty($_GET["menu"])) {
    $request = $_GET["menu"];
    if ($request == "city")
        $column = "Business_City";
    if ($request == "zipcode")
        $column = "Business_Zipcode";
    if ($request == "state")
        $column = "Business_State";
}

$query = "SELECT DISTINCT `" . $column . "` FROM `AN_Alumni_New` ORDER BY `" . $column . "`";
$result = mysql_query($query);

if (!$result) {
    die('Invalid query: ' . mysql_error());
}

while ($row = mysql_fetch_array($result)) {
    //echo "<li><a onclick = 'populate(" . $request . ", " . $row[$column] . ")'><span>" . $row[$column] . "</span></a></li>";

    echo "<li><a onclick=\"populate(" . "'" . $request . "', " . "'" . $row[$column] . "'" . ")\"><span>" . $row[$column] . "</span></a></li>";
}

mysql_close($connection);
?>