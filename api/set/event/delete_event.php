<?php 

require "../h.php";

// /api/set/event/delete_event.php?name=test event 2&start_date=2000-01-01&end_date=2000-01-01&location=description&gauge_list=blah&num_stations=14&max_mulligans=4&admin_email=email@dave.com

$response = "ERROR: Inputs improperly defined.";



//we have key
if( isset( $_GET['id'] ) ) {
		$sql = "DELETE FROM `event`  ";
		$sql .= "WHERE id = '" . $_GET["id"] . "'";
		$response = sql_set_query($sql);
}
// return response in json
jr( $response );

?>