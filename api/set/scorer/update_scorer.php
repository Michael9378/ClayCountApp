<?php 



require "../h.php";

// /api/set/scorer/update_scorer.php?event_id=2&first_name=chris&last_name=belcher&email=michael@email.com
$response = "ERROR: Inputs improperly defined.";

//we have key
if( isset( $_GET['email'] ) ) {
	//we are changing a parameter
	if(isset( $_GET['first_name'] ) || isset( $_GET['last_name'] ) || isset( $_GET['phone'] ) ) {
		$sql = "UPDATE `scorer` SET ";
		//if statements for the update
		if( isset( $_GET["first_name"] ) )
			$sql .= "first_name = '" . $_GET["first_name"] . "' ,";
		if( isset( $_GET['last_name']) )
			$sql .= "last_name = '" . $_GET['last_name'] . "' ,";
		if( isset( $_GET['phone'] ) )
			$sql .= "phone = '" . $_GET['phone'] . "' ,";

		// drop last comma
		$sql = substr($sql, 0, -1);
		//specifications on the key
		$sql .= " WHERE email = '" . $_GET["email"] . "'";
		$response = sql_set_query($sql);
	}
	else {
		$response = "No updated parameters passed.";
	}

}

// return response in json
jr( $response );

?>
