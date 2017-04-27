<?php 



require "../h.php";

// /api/set/admin/add_admin.php?first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&password=pass

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET['first_name'] ) && isset( $_GET['last_name'] ) && isset( $_GET['email'] ) && isset( $_GET['phone'] ) && isset( $_GET['password'] ) ) {
	// set all parameters
	$first_name = $_GET['first_name'];
	$last_name = $_GET['last_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	$password = $_GET['password'];

	// check if scorer already exists
	$requested_admin = json_decode( file_get_contents( 'http://'.$_SERVER['HTTP_HOST']."/api/get/admin/get_admin.php?email=".$email ) );
	if( $requested_admin )
		$response = "ERROR: Admin with that email already exists.";
	else {
		// build query
		$sql = "INSERT INTO `admin`(`first_name`, `last_name`, `email`, `phone`, `password`)";
		$sql .= "VALUES ('".$first_name."','".$last_name."','".$email."','".$phone."','".$password."');";
		// send query
		$response = sql_set_query($sql);
	}
}

// return response in json
jr( $response );

?>
