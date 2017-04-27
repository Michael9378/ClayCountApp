<?php 

// Get team by:
// Team Name (Returns Event ID)
// Event ID (Returns all Teams)

// /api/get/team/get_team.php?team_name=TEAM
// /api/get/team/get_team.php?event_id=EVENT_ID

/*
SELECT DISTINCT team.name, SUM(totals_table.total_hits) AS combined_score
FROM team, (SELECT DISTINCT person.first_name, person.last_name, person.team_name, SUM(hits) AS total_hits
FROM `person`, station
WHERE station.person_email = person.email 
GROUP BY person.email
ORDER BY SUM(hits) DESC) AS totals_table
WHERE team.name = totals_table.team_name AND team.event_id = 'blah'
GROUP BY totals_table.team_name
ORDER BY SUM(totals_table.total_hits) DESC
*/
require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

// get teams in event
if( isset( $_GET['event_id'] ) ){
	$sql = "SELECT DISTINCT team.name, SUM(totals_table.final_tally) AS combined_score
		FROM team, (SELECT DISTINCT person.first_name, person.last_name, person.team_name, SUM(num_hits) AS final_tally
		FROM `person`, station
		WHERE station.person_email = person.email 
		GROUP BY person.email
		ORDER BY SUM(num_hits) DESC) AS totals_table
		WHERE team.name = totals_table.team_name AND team.event_id = '" . $_GET['event_id']."'
		GROUP BY totals_table.team_name
		ORDER BY SUM(totals_table.final_tally) DESC";
	$response = sql_get_query($sql);
}

// return response in json
jr( $response );

?>