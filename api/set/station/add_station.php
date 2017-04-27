<?php 

// TODO: Add template of stations for which to populate each person when created.

require "../h.php";

// /api/set/station/add_station.php?event_id=blah&person_email=email1&station_num=1&num_hits=9

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['event_id'] ) && isset( $_GET['person_email'] ) && isset( $_GET['station_num'] ) && isset( $_GET['num_hits'] ) ) {
	// set all parameters
	$event_id = $_GET["event_id"];
	$person_email = $_GET["person_email"];
	$station_num = $_GET["station_num"];
	$num_hits = $_GET["num_hits"];

	// check if station already exists
	$requested_station = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/station/get_station.php?event_id=".$event_id."&person_email=".$person_email."&station_num=".$station_num ) );
	if( $requested_station )
		$response = "ERROR: This station already exists.";
	else {
		// build query
		$sql = "INSERT INTO `station`(`event_id`, `person_email`, `station_num`, `num_hits`) ";
		$sql .= "VALUES ('".$event_id."','".$person_email."','".$station_num."','".$num_hits."');";
		// send query
		$response = sql_set_query($sql);
	}
}

// return response in json
jr( $response );

?>