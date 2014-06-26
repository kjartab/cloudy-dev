<?php

session_start();
	
ini_set("memory_limit","2048M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes

function say_hello() {
	


$outline = $_GET["outline"];
$id = $_GET["id"];
$option = $_GET["option"];
$extra = $_GET["extra"];

$dbconn = pg_connect("host=localhost port=5433 dbname=mbe user=postgres password=kjartan");

$result = null;

if(!$dbconn) die('coud not connect to pgsql');


	switch($option) {
	
	case 'polygon':
		$result = pg_query($dbconn, 
			"WITH pts AS (with pcs as (
					SELECT id ids FROM helsinki where PC_Intersects(pa, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),3067),3067))
				)
				SELECT PC_explode(pa) pt from helsinki, pcs where id=pcs.ids
			)
			SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry)*-1 z, 65536 , 65536 , 65536, 1, 1 FROM pts where  ST_Intersects(pt::geometry, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),3067),3067));");
		
	break;
	case 'circle': 
		$result = pg_query($dbconn, 
		
			"WITH pts AS(
				WITH pcs AS( 
					WITH outline AS( 
							the_outline
					)
					SELECT id covered_patches FROM helsinki, outline WHERE PC_Intersects(pa, the_outline)
				)
				SELECT PC_explode(pa) pt from helsinki, pcs where id=pcs.covered_patches
			)
			SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry)*-1 z, 65536 , 65536 , 65536, 1, 1 FROM pts where  ST_Intersects(pt::geometry, ST_SetSRID(ST_Transform(ST_Buffer(ST_Transform(ST_SetSRID(" .$outline. ",4326),3067)," .$extra. "),3067),3067));");
		
	
	break;
	case 'buffer':
		$result = pg_query($dbconn, 
			"WITH pts AS (with pcs as (
				SELECT id ids FROM helsinki where PC_Intersects(pa, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),3067),3067)))
				SELECT PC_explode(pa) pt from helsinki, pcs where id=pcs.ids)
			SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry)*-1 z, 65536 , 65536 , 65536, 1, 1 FROM pts where  ST_Intersects(pt::geometry, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .$outline. "'),4326),3067),3067));");
		
	
	break;
	}
	

	


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
