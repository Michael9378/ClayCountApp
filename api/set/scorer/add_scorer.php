<?php 



require "../h.php";

// /api/set/scorer/add_scorer.php?event_id=blah&first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&station_num=2

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['event_id'] ) && isset( $_GET['first_name'] ) && isset( $_GET['last_name'] ) && isset( $_GET['email'] ) && isset( $_GET['phone'] ) && isset( $_GET['station_num'] ) && isset( $_GET['station_num'] ) ) {
	// set all parameters
	$event_id = $_GET['event_id'];
	$first_name = $_GET['first_name'];
	$last_name = $_GET['last_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	$password = $_GET['password'];
	$station_num = $_GET['station_num'];

	// check if scorer already exists
	$requested_scorer = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/scorer/get_scorer.php?email=".$email."&event_id=".$event_id ) );
	if( $requested_scorer )
		$response = "ERROR: Scorer with that email already exists for this event.";
	else {
		// build query
		$sql = "INSERT INTO `scorer` (`event_id`, `first_name`, `last_name`, `email`, `phone`, `password`, `station_num`)";
		$sql .= "VALUES ('".$event_id."','".$first_name."','".$last_name."','".$email."','".$phone."','".$password."','".$station_num."');";
		// send query
		$response = sql_set_query($sql);
	}
}

// return response in json
jr( $response );

?>
