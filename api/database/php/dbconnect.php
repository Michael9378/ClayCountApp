<?php 
// Connect to database.
// hide this file from github

$dbservername = "mariadb-023.wc1.ord1.stabletransit.com";
$dbname = "702637_claycounter";
$dbusername = "702637_dbuser";
$dbpassword = "Count_Me_In_123";
// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// // Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>