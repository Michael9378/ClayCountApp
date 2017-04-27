<?php 

// all set queries here

// Insert, Update, Drop queries use this
// returns true or false
function sql_set_query($sql) {

	// prepare connection to database
	require "dbconnect.php";

	// connect to database
	mysqli_connect( $dbservername, $dbusername, $dbpassword );

	// make the query
	$response = $conn->query($sql);

	// close connection
	mysqli_close();

	return $response;
}

?>