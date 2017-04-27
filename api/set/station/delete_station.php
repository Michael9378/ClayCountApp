<?php 

// TODO: Add template of stations for which to populate each person when created.

require "../h.php";

// /api/set/station/delete_station.php?event_id=blah&person_email=email1&station_num=1&num_hits=9

$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['event_id'] ) && isset( $_GET['person_email'] ) && isset('station_num') ) {
		$sql = "DELETE FROM `station` ";
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND email = '" . $_GET["person_email"] . "'";
		$sql .= " AND email = '" . $_GET["station_num"] . "'";
		$response = sql_set_query($sql);
}

// return response in json
jr( $response );

?>