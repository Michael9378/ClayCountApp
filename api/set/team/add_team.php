<?php 



require "../h.php";

// /api/set/team/add_team.php?name=TEAM&event_id=KEY

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['name'] ) && isset( $_GET['event_id'] ) ) {
	// set all parameters
	$name = $_GET['name'];
	$event_id = $_GET['event_id'];

	// check if event already exists
	$requested_team = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/team/get_team.php?name=".$name."&event_id=".$event_id ) );
	if( $requested_team )
		$response = "ERROR: Team with that name already exists for this event.";
	else {
		// build query
		$sql = "INSERT INTO `team` (`name`, `event_id`)";
		$sql .= "VALUES ('".$name."','".$event_id."');";
		// send query
		$response = sql_set_query($sql);
	}
}

// return response in json
jr( $response );

?>