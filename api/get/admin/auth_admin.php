<?php 


// Authorize admin with passed email and password
// Returns true or false

// /api/get/admin/auth_admin.php?email=KEY&password=PASSWORD

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// need email and password for auth
if ( isset( $_GET['email'] ) && isset( $_GET['password'] ) ){
	// returns 1 or 0
	$sql = "SELECT COUNT(*) FROM (SELECT DISTINCT 1 FROM `admin` WHERE `email` = '" . $_GET['email']."' AND `password` = '" . $_GET['password']."') AS a";
	// format response to be true or false.
	$response = sql_get_query($sql)[0]["COUNT(*)"] == 1;
}

// return response in json
jr( $response );
?>