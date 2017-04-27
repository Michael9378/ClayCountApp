<?php 

// Get team by:
// Team Name (Returns Event ID)
// Event ID (Returns all Teams)

// /api/get/team/get_team.php?name=TEAM&event_id=EVENT_ID
// /api/get/team/get_team.php?name=TEAM
// /api/get/team/get_team.php?event_id=EVENT_ID

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get team by event id and team name
if( isset( $_GET['name'] ) AND isset( $_GET['event_id'] ) ){
	$sql = "SELECT `event_id` FROM `team` WHERE name = '" . $_GET['name']."' AND  event_id = '" . $_GET['event_id']."'";
	$response = sql_get_query($sql);
}

// get team by name
else if( isset( $_GET['name'] ) ){
	$sql = "SELECT `event_id` FROM `team` WHERE name = '" . $_GET['name']."'";
	$response = sql_get_query($sql);
}

// get teams in event
else if( isset( $_GET['event_id'] ) ){
	$sql = "SELECT `name` FROM `team` WHERE event_id = '" . $_GET['event_id']."'";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>