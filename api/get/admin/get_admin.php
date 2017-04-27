<?php 

// Get admin by:
// email

// /api/get/admin/get_admin.php?email=EMAIL
require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get event by id. 
if( isset( $_GET['email'] ) ){
	$sql = "SELECT `first_name`, `last_name`, `email`, `phone` FROM `admin` WHERE email = '" . $_GET['email']."'";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>