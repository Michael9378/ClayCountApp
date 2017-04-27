<?php 

// Get teams by:
// Admin Email (Returns all Teams)

// /api/get/team/get_all_teams.php?admin_email=EMAIL

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get all persons in event
if( isset( $_GET['admin_email'] ) ){
	// SELECT * FROM `team` WHERE event_id IN (SELECT id FROM `event` WHERE admin_email = 'mike@email.com');
	$sql = "SELECT * FROM `team` WHERE event_id IN (SELECT id FROM `event` WHERE admin_email = '". $_GET['admin_email'] ."');";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>