
<?php
	header('Content-Type: application/json');
$dbconn = pg_pconnect("host=localhost port=5432 dbname=isurvey_rawdata_etl user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());

	$result = pg_query($dbconn, "SELECT row_to_json(feature_collection)
		FROM ( SELECT 'FeatureCollection' AS type, 
			array_to_json(array_agg(feature)) As features
			FROM (	

				SELECT 'Feature' AS type, 
			
				ST_AsGeoJson(ST_Transform(ST_MakeLine(k.point),4326))::json AS geometry

				FROM (SELECT s.point, s.id as sid FROM rawpoints s order by postime) k


				) AS feature 	

			) AS feature_collection;			

   ");			

   		

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

