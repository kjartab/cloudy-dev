<?php
	
Class DatabaseHelper {
		
	private $host;
	private $port;
	private $dbname;
	private $user;
	private $password;	
	private $dbconn;
	private $dbresult;
	
	
    public function __construct($db) {
		$this->dbArray = $db;
	}
	
	public function connect() {	
		if ($this->dbconn == null) {
			$this->dbconn = pg_connect($this->dbArray['connectionString']);	
		} else {
			echo 'connection already established';	
		}
	}
	
	
	public function runQuery($queryText) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = pg_query($queryText);
		}
		return $this->transformResult($dbresult);
	}
	
	private function transformResult($dbres) {
		$data = array();
		while ($row = pg_fetch_row($dbres)) {
			$data[] = $row;
		}
		return json_encode($data);
	}
	
	public function getTable($table) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT id, ST_AsGeoJson(ST_Transform(geom,4326)) FROM ' .$table. '');
			if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	
	public function getRecordFromTable($table,$id) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT * FROM ' .$table.' WHERE id=' .$id. ';');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	// --------------- Functions specifically dealing with Langeland database tables --------------- 
	
	public function getGeoJsonTracks() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT row_to_json(feature_collection)
									FROM ( SELECT \'FeatureCollection\' AS type, 
										array_to_json(array_agg(feature)) As features
										FROM (	
											SELECT \'Feature\' AS type, 
											ST_AsGeoJson(ST_Transform(k.track_line,4326))::json AS geometry, 
											row_to_json((SELECT seg_id FROM (SELECT sid) AS seg_id)) AS properties
											FROM (SELECT track_line, s.id as sid FROM segment_table s) k
											) AS feature 
										) AS feature_collection;');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	public function getPointClouds() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = pg_query("SELECT * FROM pointmetadata");
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}

	public function getPoints($outline, $dataset) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query("
						WITH pts AS (with pcs as (
								SELECT paid FROM ".$dataset."_indexlayer where ST_Intersects(patchgeom, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('".urldecode($outline)."'),4326),32632),32632)))
							SELECT PC_Explode(pa) pt from ".$dataset.", pcs where id=pcs.paid)
						SELECT 1, ST_X(pt::geometry) x, ST_Y(pt::geometry) y, ST_Z(pt::geometry) z, 65536 , 65536 , 65536, 1, 1 FROM pts where  ST_Intersects(pt::geometry, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('" .urldecode($outline). "'),4326),32632),32632));"
						);
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}




	public function getPointCloudMeta($outline, $dataset) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query("WITH patches as (
									SELECT paid FROM dklidar_indexlayer where ST_Intersects(patchgeom, ST_SetSRID(ST_Transform(ST_SetSRID(ST_GeomFromText('".$outline."'),4326),32632),32632))
									)
									SELECT SUM(PC_NumPoints(pa)) from dklidar, patches where paid=id;");
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}

}

?>