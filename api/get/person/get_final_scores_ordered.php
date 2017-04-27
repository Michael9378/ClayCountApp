<?php 


// Get persons by:
// Email
// First/Last Name
// Team Name

// /api/get/person/get_person.php?email=EMAIL&event_id=KEY&team_name=TEAM_NAME
// /api/get/person/get_person.php?email=EMAIL
// /api/get/person/get_person.php?first_name=FIRST_NAME&last_name=LAST_NAME
// /api/get/person/get_person.php?event_id=KEY&team_name=TEAM_NAME


/*SELECT DISTINCT person.first_name, person.last_name, person.team_name, person.gauge, SUM( num_hits ) AS final_tally
			FROM  `person` , station, event
			WHERE station.person_email = person.email
			AND event.id = '2' AND person.gauge = 12
			GROUP BY person.email
			ORDER BY SUM( num_hits ) DESC
*/

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// Gets a list of persons at the given event and orders them by their score seperated by gauge class
if(isset( $_GET['event_id'] ) ){
	$sql = "SELECT DISTINCT person.first_name, person.last_name, person.team_name, person.gauge, SUM( num_hits ) AS final_tally
			FROM  `person` , station, event
			WHERE station.person_email = person.email
			AND event.id = '" . $_GET['event_id']."'
			GROUP BY person.email
			ORDER BY SUM( num_hits ) DESC";
	$response = sql_get_query($sql);
}



// return response in json
jr( $response );

?>