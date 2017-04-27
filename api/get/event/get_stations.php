<?php 

require "../h.php";

$response = "ERROR: no accetable parameters were set.";
// build the sql query

if( isset( $_GET['admin_email'] ) ){
	$sql = "SELECT * FROM `station_details` WHERE `event_id` IN (SELECT `id` FROM `event` WHERE `admin_email` = '" . $_GET['admin_email']."')";
	$response = sql_get_query($sql);
}
elseif( isset( $_GET['event_id'] ) ){
	$sql = "SELECT * FROM `station_details` WHERE `event_id` = '".$_GET['event_id']."';";
	$response = sql_get_query($sql);
}

// make seperate calls for scorer email
// else if( isset( $_GET['admin_email'] ) ){
// 	$sql = "SELECT * FROM `station_details` WHERE `event_id` IN (SELECT `id` FROM `event` WHERE `admin_email` = '" . $_GET['admin_email']."')";
// 	$response = sql_get_query($sql);
// }

// return response in json
jr( $response );

?>