<?php 

// TODO: Add fill_stations

require "../h.php";

// /api/set/person/update_person.php?event_id=3&team_name=team1&first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&gauge=gauge1&mulligans=10

// /api/set/person/update_person.php?event_id=3&team_name=Capstone Team&email=mike@email.com&last_name=Rainsford
$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['event_id'] ) && isset( $_GET['old_team_name'] ) && isset( $_GET['email'] ) ) {

	//we are changing a parameter
	if(isset( $_GET['first_name'] ) || isset( $_GET['last_name'] ) || isset( $_GET['phone'] ) || isset( $_GET['gauge'] ) || isset( $_GET['mulligans'] ) ) {
		$sql = "UPDATE `person` SET ";
		//if statements for the update
		if( isset( $_GET["new_team_name"] ) )
			$sql .= "team_name = '" . $_GET["new_team_name"] . "' ,";
		if( isset( $_GET["first_name"] ) )
			$sql .= "first_name = '" . $_GET["first_name"] . "' ,";
		if( isset( $_GET['last_name']) )
			$sql .= "last_name = '" . $_GET['last_name'] . "' ,";
		if( isset( $_GET['phone'] ) )
			$sql .= "phone = '" . $_GET['phone'] . "' ,";
		if( isset( $_GET['gauge'] ) )
			$sql .= "gauge = '" . $_GET['gauge'] . "' ,";
		if( isset( $_GET["mulligans"] ) )
			$sql .= "mulligans = '" . $_GET["mulligans"] . "' ,";


		// drop last comma
		$sql = substr($sql, 0, -1);
		//specifications on the key
		$sql .= "WHERE event_id = '" . $_GET["event_id"] . "'";
		$sql .= " AND team_name = '" . $_GET["old_team_name"] . "'";
		$sql .= " AND email = '" . $_GET["email"] . "'";
		$response = sql_set_query($sql);
	}
	else {
		$response = "No updated parameters passed.";
	}

}

// return response in json
jr( $response );

?>