<?php 

// TODO: Add fill_stations

require "../h.php";




// /api/set/person/delete_person.php?event_id=2&team_name=Capstone Team&email=mike@email.com
$response = "ERROR: Inputs improperly defined.";



//we have key
if( isset( $_GET['event_id'] ) && isset( $_GET['team_name'] ) && isset( $_GET['email'] ) ) {
		$sql = "DELETE FROM `person` ";
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND team_name = '" . $_GET["team_name"] . "'";
		$sql .= " AND email = '" . $_GET["email"] . "'";
		$response = sql_set_query($sql);
}


// return response in json
jr( $response );

?>