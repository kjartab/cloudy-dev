<?php
require_once('includes/api.lib.php');
require_once('includes/DatabaseHelper.php');
require_once('includes/DatabaseRestricted.php');

	$requestObj = new Controller();
	$dbHelper = new DatabaseHelper();
	$dbWriter = new DatabaseRestricted();
	$request = $requestObj->getRequest();

		
		$data = $requestObj->getData();
		switch( $requestObj->getMethod() ) {
			case 'get':
				
				$request = explode("/", $_SERVER['REQUEST_URI'] );
				
				$dbHelper->connect();
				
				$res = '';
				
				// if data -> show overview 	
				
				if (count($request) > 3 AND $request[2] == 'data') {
					
					switch($request[3]) {
					
						// ------------- Handle all geometry queries ------------- 
						case 'spatial':
							if (count($request)==5 OR (count($request)==6 AND $request[5] == null)) {	
	
								$res = $dbHelper->getTable($request[4]);
							} else if (count($request)==6 AND is_numeric($request[5])) {
							
								$res = $dbHelper->getRecordFromTable($request[4],$request[5]);
							} else {
								return Controller::respond(404);
							}
							
							echo $res;
							
							break;
							
							
							
							
						// ------------- Handle the spatiotemporal queries ------------- 
						case 'pointclouds':
							
							$res = $dbHelper->getPointClouds();
							
							echo $res;
							break;
							
						
							
						case 'points':
							
							
					}
				} else {
					header("Location: /cloudy-dev/data/");
					die();
					
				} 
				
				
				if (!$res) {
					echo 'error';
				} 
				break;
				
			case 'post':
				$dat = $_POST["data"];
				// Ensure login credentials are correct
					$dbWriter->connect();
					$dbWriter->insertTrackingPosition($dat)	;
					Controller::respond(200);
			
				break;
				
			case 'put':
				break;
				
			case 'delete':
				break;
				
			default:
				Controller::respond( 405 );
				break;
	}
	
	exit;