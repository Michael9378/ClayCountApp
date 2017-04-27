<?php 

// TODO: Add fill_stations

require "../h.php";

// /api/set/person/add_person.php?event_id=blah&team_name=team1&first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&gauge=gauge1&mulligans=10

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['event_id'] ) && isset( $_GET['team_name'] ) && isset( $_GET['first_name'] ) && isset( $_GET['last_name'] ) && isset( $_GET['email'] ) && isset( $_GET['phone'] ) && isset( $_GET['gauge'] ) && isset( $_GET['mulligans'] ) ) {
	// set all parameters
	$event_id = $_GET['event_id'];
	$team_name = $_GET['team_name'];
	$first_name = $_GET['first_name'];
	$last_name = $_GET['last_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	$gauge = $_GET['gauge'];
	$mulligans = $_GET['mulligans'];

	// check if person already exists
	$requested_person = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/person/get_person.php?email=".$email."&event_id=".$event_id."&team_name=".$team_name ) );
	if( $requested_person )
		$response = "ERROR: Person with that email already exists.";
	else {
		// build query
		$sql = "INSERT INTO `person` (`event_id`, `team_name`, `first_name`, `last_name`, `email`, `phone`, `gauge`, `mulligans`)";
		$sql .= "VALUES ('".$event_id."','".$team_name."','".$first_name."','".$last_name."','".$email."','".$phone."','".$gauge."','".$mulligans."');";
		// send query
		if( sql_set_query( $sql ) ){
			// we inserted the person. Now update the stations.
			$sql = "INSERT INTO `station`(`event_id`, `person_email`, `station_num`, `num_hits`, `total_hits`) VALUES ";
			$stations_schema = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/event/get_stations.php?event_id=".$event_id ) );
			for( $j = 0; $j < count($stations_schema); $j++ ){
				$sql .= "('".$event_id."', '".$email."', '".$stations_schema[$j]->station_num."','".$stations_schema[$j]->num_hits."','".$stations_schema[$j]->total_hits."'),";
			}
			$sql = substr($sql, 0, -1);
			$sql .= ";";
			$response = sql_set_query( $sql );
			// var_dump($stations_schema);
		}
		else
			$response = "Error inserting person into the database.";
	}
}

// return response in json
jr( $response );

?>