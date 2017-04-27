<?php 


// Get station by:
// Event ID/Persons Email/Station Number
// Event ID/Persons Email

// /api/get/station/get_station.php?event_id=KEY&person_email=EMAIL&station_num=NUM
// /api/get/station/get_station.php?event_id=KEY&person_email=EMAIL
// /api/get/station/get_station.php?event_id_list=ID_LIST
// /api/get/station/get_station.php?scorer_email=ye@email.com

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// station by event id, person email, and station number. Should only return 1 station
if( isset( $_GET['event_id'] ) && isset( $_GET['person_email'] ) && isset( $_GET['station_num'] ) ){
	$sql = "SELECT * FROM `station` WHERE event_id ='" . $_GET['event_id']."' AND person_email = '" . $_GET['person_email']."' AND station_num = '" . $_GET['station_num']."'";
	$response = sql_get_query($sql);
}

// get all stations given a single person and event.
else if( isset( $_GET['event_id'] ) && isset( $_GET['person_email'] ) ){
	$sql = "SELECT * FROM `station` WHERE event_id ='" . $_GET['event_id']."' AND person_email = '" . $_GET['person_email']."'";
	$response = sql_get_query($sql);
}
else if( isset( $_GET["event_id_list"] ) ){
	$id_arr = explode(",", $_GET["event_id_list"] );
	$sql = "SELECT * FROM `station` WHERE ";
	foreach ($id_arr as $id) {
		$sql .= "event_id = '" . $id."' OR ";
	}
	$sql = substr($sql, 0, -3);
	$response = sql_get_query($sql);
}
else if( isset( $_GET["scorer_email"] ) ){

	$sql = "SELECT *
		FROM `person`
		JOIN (SELECT *
		FROM `station`
		WHERE (`event_id`,`station_num`) IN (
			SELECT `event_id`,`station_num`
			FROM `scorer`
			WHERE `email` = '".$_GET["scorer_email"]."')) as filteredStation
		ON filteredStation.event_id = person.event_id AND person.email = filteredStation.person_email";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>