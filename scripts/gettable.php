
	<?php

		
		header('Content-Type: application/json');
	$dbconn = pg_pconnect("host=localhost port=5432 dbname=lidardb user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());


			
		$result = pg_query($dbconn, "select id, name,ST_AsGeoJson(ST_Transform(outline,4326)) from pointmetadata");		
			

	   

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

