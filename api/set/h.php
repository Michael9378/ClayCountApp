<?php 
// header file for /get/ functions
// include global functions and get queries

// root directory is two folders up from calling file
$root_dir = getcwd().'/../../';

// use for json response function
require $root_dir.'global_functions.php';
// use for sql_set_query($sql);
require $root_dir.'database/php/set_queries.php';

?>