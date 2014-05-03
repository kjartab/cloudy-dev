<?php

session_start();
	
ini_set("memory_limit","2048M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

function say_hello() {
	
	
$outline = $_GET["outline"];
// $table = $_GET["table"];

$dbconn = pg_connect("host=localhost port=5433 dbname=mbe user=postgres password=kjartan");

$result = null;

if(!$dbconn) die('coud not connect to pgsql');


				

	$result = pg_query($dbconn, 
		"WITH pts AS (with pcs as (select id ids FROM franklin_asleft where PC_Intersects(pa, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),100031),32632)))
			SELECT PC_explode(pa) pt from franklin_asleft, pcs where id=pcs.ids)
		SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry)*-1 z, 65536 , 65536 , 65536, 1, 1 FROM pts where  ST_Intersects(pt::geometry, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),100031),32632));");
		


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
