<?

// Anteater Network
// (C) 2012 Team JMMP
// Jola Bolaji, Mark Chege, Melvin Chien, Patrick Chen
// instdav.ics.uci.edu/phpmyadmin
// inmotionhosting.com/support/edu/website-design/using-php-and-mysql/grab-all-comments-from-database

require("andb-login.php");

// Start XML file and create parent node
$dom = new DOMDocument("1.0");
$node = $dom->createElement("alumni");
$parnode = $dom->appendChild($node);


// Set up connection to MySQL server
$con = mysql_connect($ip, $username, $password);

// If the connection failed for any reason (such as wrong username
// and or password, we will print the error below and stop execution
// of the rest of this php script
if (!$con) {
    die('Could not connect: ' . mysql_error());
}

// We now need to select the particular database that we are working with

$db_selected = mysql_select_db($db, $con);
if (!$db_selected) {
    die('Can\'t use db : ' . mysql_error());
}

// Select rows in the table matching query
// $query = "SELECT * FROM AN_Alumni WHERE Business_City LIKE '" . $_GET["Business_City"] . "'";

// Select all the rows in the tables
$query = "SELECT * FROM AN_Alumni";

$alumni = mysql_query($query);
if (!$alumni) {
    die('Invalid query: ' . mysql_error());
}

header("Content-type: text/xml");

// Iterate through the rows, adding XML nodes for each

while ($row = @mysql_fetch_assoc($alumni)) {
    // ADD TO XML DOCUMENT NODE
    $node = $doc->createElement("alumnus");
    $newnode = $parnode->appendChild($node);
    $newnode->setAttribute("ID_Number", $row['ID_Number']);
    $newnode->setAttribute("Last_Name", $row['Last_Name']);
    $newnode->setAttribute("First_Name", $row['First_Name']);
    $newnode->setAttribute("Class_Year", $row['Class_Year']);
    $newnode->setAttribute("School_Code", $row['School_Code']);
    $newnode->setAttribute("Business_Title", $row['Business_Title']);
    $newnode->setAttribute("Business_Name", $row['Business_Name']);
    $newnode->setAttribute("Business_Street1", $row['Business_Street1']);
    $newnode->setAttribute("Business_Street2", $row['Business_Street2']);
    $newnode->setAttribute("Business_City", $row['Business_City']);
    $newnode->setAttribute("Business_State", $row['Business_State']);
    $newnode->setAttribute("Business_Zipcode", $row['Business_Zipcode']);
    $newnode->setAttribute("Business_Phone", $row['Business_Phone']);
    $newnode->setAttribute("Business_Phone_Ext", $row['Business_Phone_Ext']);
    $newnode->setAttribute("Business_Lat", $row['Business_Lat']);
    $newnode->setAttribute("Business_Lng", $row['Business_Lng']);
}
echo $dom->saveXML();
//$xmlfile = $doc->dump_mem();
//echo $xmlfile;

// Close connection to database
//mysql_close($con);
?>