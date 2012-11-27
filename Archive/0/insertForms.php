<?php
$con=mysql_connect("localhost","root","");
if(!$con){die('This did not connect to the mysql server: '.mysql_error());
}
mysql_select_db("anteator_network",$con);

$sql = "INSERT INTO region(County, City)
VALUES
('$_GET[county]','$_GET[city]')";

if(!mysql_query($sql,$con)){
die('Error: '.mysql_error());
}
echo "One Record Inserted";
mysql_close($con);
?>