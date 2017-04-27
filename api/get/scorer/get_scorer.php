<?php 


// Get scorer by:
// Event ID/Email
// Event ID

// /api/get/scorer/get_scorer.php?event_id=KEY&email=EMAIL
// /api/get/scorer/get_scorer.php?email=EMAIL
// /api/get/scorer/get_scorer.php?event_id=KEY

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// Get single scorer by email and event id
if ( isset( $_GET['email'] ) && isset( $_GET['event_id'] ) ){
	$sql = "SELECT  `event_id`, `first_name`, `last_name`, `email`, `phone`, `station_num` FROM `scorer` WHERE `event_id` = '" . $_GET['event_id']."' AND `email` = '" . $_GET['email']."'";
	$response = sql_get_query($sql);
}

// Get all scorers in an event
else if ( isset( $_GET['email'] ) ){
	$sql = "SELECT  `event_id`, `first_name`, `last_name`, `email`, `phone`, `station_num` FROM `scorer` WHERE `email` = '" . $_GET['email']."'";
	$response = sql_get_query($sql);
}

// Get all scorers in an event
else if ( isset( $_GET['event_id'] ) ){
	$sql = "SELECT  `event_id`, `first_name`, `last_name`, `email`, `phone`, `station_num` FROM `scorer` WHERE `event_id` = '" . $_GET['event_id']."'";
	$response = sql_get_query($sql);
}

// Get all scorers in an event
else if ( isset( $_GET['admin_email'] ) ){
	$sql = "SELECT * FROM `scorer` WHERE `event_id` IN (SELECT `id` FROM `event` WHERE `admin_email` = '".$_GET['admin_email']."')";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );
?>