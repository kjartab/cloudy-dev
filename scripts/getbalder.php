
<?php

	
	header('Content-Type: application/json');
$dbconn = pg_pconnect("host=localhost port=5433 dbname=mbe user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());


		
	$result = pg_query($dbconn, "select id, layer, layer, ST_AsGeoJson(ST_Transform(geom,4326)) from balderll");		
		

   

	if (!$result) {
	  echo "An error occured.\n";
	  exit;
	}
	
	$data = array();

	while ($row = pg_fetch_row($result)) {
		$data[] = $row;
	}
	
	pg_close($dbconn);
	
	print json_encode($data);

	?>

