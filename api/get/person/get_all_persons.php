<?php 

// Get persons by:
// admin email

// /api/get/person/get_all_persons.php?admin_email=EMAiL

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get all persons in events
if( isset( $_GET['admin_email'] ) ){
	$sql = "SELECT * FROM `person` WHERE event_id IN (SELECT id FROM `event` WHERE admin_email = '". $_GET['admin_email'] ."');";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>