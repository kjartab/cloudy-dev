<?php

session_start();
	
ini_set("memory_limit","4096M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

function getpoints() {
	
	
$dbconn = pg_connect("host=localhost port=5432 dbname=melhus user=postgres password=postgres");

$result = null;

if(!$dbconn) die('coud not connect to pgsql');

	$result = pg_query($dbconn, 
		"WITH pts AS (SELECT PC_Explode(pa) AS pt FROM laserdata limit 500000)
        SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry) z, 65535/PC_Get(pt::pcpoint, 'Classification') , 65535/PC_Get(pt::pcpoint, 'Classification') , 65535, 1, 1 FROM pts;");
		


	if (!$result) {
	  echo "An error occured.\n";
	  exit; 	
	}

	$data = array();
	$first = true;
	while ($row = pg_fetch_row($result)) {
		$data[] = $row;
	}
	
	return json_encode($data);
	
}
echo getpoints();

?>
