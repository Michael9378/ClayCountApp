<?php 

// Get event by:
// event id
// event name
// admin email
// scorer email

// /api/get/event/get_event.php?event_id=EVENT_ID
// /api/get/event/get_event.php?event_name=EVENT_NAME
// /api/get/event/get_event.php?admin_email=EMAIL
// /api/get/event/get_event.php?scorer_email=EMAIL

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get event by id. 
if( isset( $_GET['event_id'] ) ){
	$sql = "SELECT * FROM `event` WHERE id = '" . $_GET['event_id']."'";
	$response = sql_get_query($sql);
}

// get event by name. can return multiple events.
else if( isset( $_GET['event_name'] ) ){
	$sql = "SELECT * FROM `event` WHERE name = '" . $_GET['event_name']."'";
	$response = sql_get_query($sql);
}

// get events by admin email. can return multiple events.
else if( isset( $_GET['admin_email'] ) ){
	$sql = "SELECT * FROM `event` WHERE admin_email = '" . $_GET['admin_email']."'";
	$response = sql_get_query($sql);
}

// get events by scorer email. Can return multiple events.
else if( isset( $_GET['scorer_email'] ) ){
	$sql = "SELECT * FROM `event` WHERE id IN (SELECT `event_id` FROM `scorer` WHERE email = '" . $_GET['scorer_email']."')";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>