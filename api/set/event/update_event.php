<?php 

require "../h.php";

// /api/set/event/update_event.php?id=2&name=test event thing
$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['event_id'] ) ) {
	//we are changing a parameter
	if(isset( $_GET['admin_email'] ) || isset( $_GET['name'] ) || isset( $_GET['start_date'] ) || isset( $_GET['end_date'] ) || isset( $_GET['location'] )  || isset( $_GET['gauge_list'] ) || isset( $_GET['num_stations'] ) || isset( $_GET['max_mulligans'] ) ) {

		$sql = "UPDATE `event` SET ";
		//if statements for the update
		if( isset( $_GET["name"] ) )
			$sql .= "name = '" . $_GET["name"] . "' ,";
		if( isset( $_GET['start_date']) )
			$sql .= "start_date = '" . $_GET['start_date'] . "' ,";
		if( isset( $_GET['end_date'] ) )
			$sql .= "end_date = '" . $_GET['end_date'] . "' ,";
		if( isset( $_GET['location'] ) )
			$sql .= "location = '" . $_GET['location'] . "' ,";
		if( isset( $_GET["gauge_list"] ) )
			$sql .= "gauge_list = '" . $_GET["gauge_list"] . "' ,";
		if( isset( $_GET['num_stations']) )
			$sql .= "num_stations = '" . $_GET['num_stations'] . "' ,";
		if( isset( $_GET['max_mulligans'] ) )
			$sql .= "max_mulligans = '" . $_GET['max_mulligans'] . "' ,";
		if( isset( $_GET['admin_email'] ) )
			$sql .= "admin_email = '" . $_GET['admin_email'] . "' ,";

		// drop last comma
		$sql = substr($sql, 0, -1);
		$sql .= "WHERE id = '" . $_GET["event_id"] . "'";
		if( sql_set_query($sql) )
			$response = array('id' => $_GET["event_id"] );
		else
			$response = "Problem updating event. sql: " . $sql;
	}
	else {
		$response = "No updated parameters passed.";
	}

}

// return response in json
jr( $response );

?>