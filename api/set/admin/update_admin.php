<?php 



require "../h.php";

// /api/set/admin/update_admin.php?first_name=chris&last_name=belcher&email=email3&phone=555-555-5555&password=pass

$response = "ERROR: Inputs improperly defined.";

// check all parameters are present
if( isset( $_GET["email"] ) ){
	if( isset( $_GET['first_name'] ) || isset( $_GET['last_name'] ) ||  isset( $_GET['phone'] ) || isset( $_GET['password'] ) ){
		// we have key
		$sql = "UPDATE `admin` SET ";
		//if statements for the update
		if( isset( $_GET["first_name"] ) )
			$sql .= "first_name = '" . $_GET["first_name"] . "' ,";
		if( isset( $_GET['last_name']) )
			$sql .= "last_name = '" . $_GET['last_name'] . "' ,";
		if( isset( $_GET['phone'] ) )
			$sql .= "phone = '" . $_GET['phone'] . "' ,";
		if( isset( $_GET['password'] ) )
			$sql .= "password = '" . $_GET['password'] . "' ,";

		// drop last comma
		$sql = substr($sql, 0, -1);
		$sql .= "WHERE email = '" . $_GET["email"] . "'";

		$response = sql_set_query($sql);
	}
	else {
		$response = "No updated parameters passed.";
	}

}

//return response json
jr( $response );

