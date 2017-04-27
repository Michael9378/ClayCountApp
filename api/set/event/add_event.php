<?php 

require "../h.php";

// /api/set/event/add_event.php?name=test event 2&start_date=2000-01-01&end_date=2000-01-01&location=description&gauge_list=blah&num_stations=14&max_mulligans=4&admin_email=email@dave.com

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['name'] ) && isset( $_GET['start_date'] ) && isset( $_GET['end_date'] ) && isset( $_GET['location'] ) && isset( $_GET['gauge_list'] ) && isset( $_GET['num_stations'] ) && isset( $_GET['max_mulligans'] ) && isset( $_GET['admin_email'] ) && isset( $_GET['num_hits'] ) ) {
	// set all parameters
	$id = dechex( time()*rand(75, 100)/100 );
	$name = $_GET['name'];
	$start_date = $_GET['start_date'];
	$end_date = $_GET['end_date'];
	$location = $_GET['location'];
	$gauge_list = $_GET['gauge_list'];
	$num_stations = $_GET['num_stations'];
	$num_hits = $_GET['num_hits'];
	$max_mulligans = $_GET['max_mulligans'];
	$admin_email = $_GET['admin_email'];

	// build query
	$sql = "INSERT INTO `event` (`id`, `name`, `start_date`, `end_date`, `location`, `gauge_list`, `num_stations`, `max_mulligans`, `admin_email`)";
	$sql .= "VALUES ('".$id."','".$name."','".$start_date."','".$end_date."','".$location."','".$gauge_list."','".$num_stations."','".$max_mulligans."','".$admin_email."');";

	// build station details for db
	$sql_stations = "INSERT INTO `station_details` (`event_id`, `station_num`, `total_hits`) VALUES";
	// insert into station details
	for( $i = 0; $i < count( $num_hits ); $i++ ){
		$sql_stations .= "( '" . $id . "', " . ($i+1) . ", " . $num_hits[$i] . " ),";
	}
	$sql_stations = substr($sql_stations, 0, -1);
	$sql_stations .= ";";
	// send query
	if( sql_set_query($sql) ){
		if( sql_set_query( $sql_stations ) )
			$response = array('id' => $id);
		else
			$response = "SQL error on insert.";
	}
	else
		$response = "SQL error on insert.";

}

// return response in json
jr( $response );

?>