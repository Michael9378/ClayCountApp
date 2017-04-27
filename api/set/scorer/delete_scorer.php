<?php 



require "../h.php";

// /api/set/scorer/delete_scorer.php?event_id=blah&first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&station_num=2

$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['event_id'] ) && isset( $_GET['email'] ) ) {
	//we are changing a parameter
		$sql = "DELETE FROM `scorer`  ";
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND email = '" . $_GET["email"] . "'";
		$response = sql_set_query($sql);

}

// return response in json
jr( $response );

?>
