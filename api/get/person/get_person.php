<?php 


// Get persons by:
// Email
// First/Last Name
// Team Name

// /api/get/person/get_person.php?email=EMAIL&event_id=KEY&team_name=TEAM_NAME
// /api/get/person/get_person.php?email=EMAIL
// /api/get/person/get_person.php?first_name=FIRST_NAME&last_name=LAST_NAME
// /api/get/person/get_person.php?event_id=KEY&team_name=TEAM_NAME

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// Get a person given an email, event_id, and team name. Will return unique person.
if( isset( $_GET['email'] ) && isset( $_GET['event_id'] ) && isset( $_GET['team_name'] ) ){
	$sql = "SELECT * FROM `person` WHERE email = '" . $_GET['email']."' AND event_id = '" . $_GET['event_id']."' AND team_name = '" . $_GET['team_name']."'";
	$response = sql_get_query($sql);
}

// Get persons given an email.
else if( isset( $_GET['email'] ) ){
	$sql = "SELECT * FROM `person` WHERE email = '" . $_GET['email']."'";
	$response = sql_get_query($sql);
}

// Get person by first and last name. Can return multiples.
else if( isset( $_GET['first_name'] ) && isset( $_GET['last_name'] ) ){
	$sql = "SELECT * FROM `person` WHERE first_name = '" . $_GET['first_name']."' AND last_name = '" . $_GET['last_name']."'";
	$response = sql_get_query($sql);
}

// Get all persons on a team, given a team name and event id
else if( isset( $_GET['event_id'] ) && isset( $_GET['team_name'] ) ){
	$sql = "SELECT * FROM `person` WHERE event_id = '" . $_GET['event_id']."' AND team_name = '" . $_GET['team_name']."'";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>