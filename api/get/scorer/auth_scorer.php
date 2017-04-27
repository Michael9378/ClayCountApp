<?php 


// Authenticate scorer by:
// Email and password

// /api/get/scorer/auth_scorer.php?email=KEY&password=PASSWORD

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// Get single scorer by email and event id
if ( isset( $_GET['email'] ) && isset( $_GET['password'] ) ){
	$sql = "SELECT COUNT(*) FROM (SELECT DISTINCT 1 FROM `scorer` WHERE `email` = '" . $_GET['email']."' AND `password` = '" . $_GET['password']."') AS s";
	// format response to be true or false.
	$response = sql_get_query($sql)[0]["COUNT(*)"] == 1;
}

// return response in json
jr( $response );
?>