<?php 



require "../h.php";

// /api/set/team/delete_team.php?name=TEAM&event_id=KEY

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['name'] ) && isset( $_GET['event_id'] ) ) {
		$sql = "DELETE FROM `team`  ";
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND name = '" . $_GET["name"] . "'";
		$response = sql_set_query($sql);
}

// return response in json
jr( $response );

?>