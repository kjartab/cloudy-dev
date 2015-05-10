<?php

session_start();
	
ini_set("memory_limit","4096M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

function getpoints() {
	
	
$dbconn = pg_connect("host=localhost port=5432 dbname=melhus user=postgres password=postgres");

$result = null;

if(!$dbconn) die('coud not connect to pgsql');

	$result = pg_query($dbconn, 
		/*"WITH pts AS (SELECT PC_Explode(pa) AS pt FROM laserdata limit 10000)
        SELECT ST_X(pt::geometry) x, ST_Y(pt::geometry) y,  ST_Z(pt::geometry) z,  ST_Z(pt::geometry), PC_Get(pt,'Classification') FROM pts;");
		*/
        
        "SELECT PC_PatchAvg(pa,'X'),PC_PatchAvg(pa,'Y'), PC_PatchAvg(pa,'Z'),1  AS pt FROM laserdata limit 10000;");
		

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
