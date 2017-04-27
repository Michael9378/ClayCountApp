<?php 

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// Gets a list of persons at the given event and orders them by their score seperated by gauge class
if( isset( $_GET['event_id'] ) && isset( $_GET['shooters'] ) ){
	$sql = "SELECT person.team_name, person.first_name, person.last_name, person.gauge, scoredStations.final_tally
		FROM `person`
		JOIN (
			SELECT station.person_email, station.event_id, SUM( num_hits ) AS final_tally 
			FROM `station` 
			WHERE `event_id` = '".$_GET['event_id']."'
			GROUP BY station.person_email) as scoredStations
		ON scoredStations.person_email = person.email AND scoredStations.event_id = person.event_id
		ORDER BY scoredStations.final_tally DESC;";
	$response = sql_get_query($sql);
}
elseif( isset( $_GET['event_id'] ) && isset( $_GET['teams'] ) ){
	$sql = "SELECT person.team_name, SUM( scoredStations.final_tally) AS team_tally
			FROM `person`
			JOIN (
				SELECT station.person_email, station.event_id, SUM( num_hits ) AS final_tally 
				FROM `station` 
				WHERE `event_id` = '".$_GET['event_id']."' 
				GROUP BY station.person_email) as scoredStations
			ON scoredStations.person_email = person.email AND scoredStations.event_id = person.event_id
			GROUP BY person.team_name
			ORDER BY team_tally DESC;";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>