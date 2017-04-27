<?php 



require "../h.php";

// /api/set/team/update_team.php?old_name=thing&event_id=2&new_name=Capstone Team

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['old_name'] ) && isset( $_GET['event_id'] ) && isset($_GET["new_name"]) ) {

		$sql = "UPDATE `team` SET ";
		$sql.="`name` = '" . $_GET["new_name"] . "'";
		//specifications on the key
		$sql .= " WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND name = '" . $_GET["old_name"] . "'";
		$response = sql_set_query($sql);
}

// return response in json
jr( $response );

?>