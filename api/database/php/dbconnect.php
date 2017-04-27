<?php 
// Connect to database.
// hide this file from github

$dbservername = "mariadb-133.wc1.ord1.stabletransit.com";
$dbname = "1031170_ccount";
$dbusername = "1031170_clayuser";
$dbpassword = "prAswEqe@ru4";
// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// // Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>