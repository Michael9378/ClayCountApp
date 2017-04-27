<?php 

// TODO: Add template of stations for which to populate each person when created.

require "../h.php";

// /api/set/station/update_station.php?event_id=2&person_email=adam@email.com&station_num=1&num_hits=5

$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['event_id'] ) && isset( $_GET['person_email'] ) && isset($_GET['station_num']) ) {
	//we are changing a parameter
	if(isset( $_GET['num_hits'] ) || isset( $_GET['total_hits'] ) ) {
		$sql = "UPDATE `station` SET ";
		//if statements for the update
		if( isset( $_GET["num_hits"] ) )
			$sql .= "num_hits = '" . $_GET["num_hits"] . "' ,";
		if( isset( $_GET['total_hits']) )
			$sql .= "total_hits = '" . $_GET['total_hits'] . "' ,";

		// drop last comma
		$sql = substr($sql, 0, -1);
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND person_email = '" . $_GET["person_email"] . "'";
		$sql .= " AND station_num = '" . $_GET["station_num"] . "'";
		

		$response = sql_set_query($sql);
	}
	else {
		$response = "No updated parameters passed.";
	}

}

// return response in json
jr( $response );

?>