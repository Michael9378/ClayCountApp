<?php 
// Global functions used in general.
// to be included in every h.php file

// shortcut for sending back a json object (jr = json response)
function jr($obj) {
	echo( json_encode( $obj ) );
}

?>