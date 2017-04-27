<?php 
// Connect to database.
// hide this file from github

$dbservername = "HOSTNAME";
$dbname = "DATABASENAME";
$dbusername = "USERNAME";
$dbpassword = "PASSWORD";
// Create connection
$conn = new mysqli($dbservername, $dbusername, $dbpassword, $dbname);

// // Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}

?>