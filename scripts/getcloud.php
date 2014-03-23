<?php

session_start();
	
ini_set("memory_limit","2048M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

function say_hello() {
	
	
$dbconn = pg_connect("host=localhost port=5432 dbname=lidar user=postgres password=kjartan");

$result = null;

if(!$dbconn) die('coud not connect to pgsql');


				

	$result = pg_query($dbconn, 
		"WITH pts AS (SELECT PC_Explode(pa)::geometry AS pt FROM southfinland_dimensional
	WHERE PC_Intersects(
		pa, ST_Transform(ST_SetSRID(ST_MakePolygon(ST_GeomFromText('LINESTRING(
		22.276919335126877 60.45175795282388,
		22.276919335126877 60.45309125547298,
		22.2803096473217 60.45309125547298, 
		22.2803096473217 60.45175795282388,
		22.276919335126877 60.45175795282388)')),4326),3067)))

		SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry) z, 65536 , 65536 , 65536, 1, 1 FROM pts;");
		


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
session_write_close();
echo say_hello();

?>
