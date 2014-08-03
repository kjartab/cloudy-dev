<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
	
ini_set("memory_limit","2048M");
ini_set('max_execution_time', 300); //300 seconds = 5 minutes
require_once('includes/api.lib.php');
require_once('includes/DatabaseHelper.php');
require_once('includes/DatabaseRestricted.php');
require_once('includes/db.php');

	$requestObj = new Controller();
	$dbHelper = new DatabaseHelper($db);
	$dbWriter = new DatabaseRestricted($db);
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
						case 'pointcloud':	
							$res = $dbHelper->getPoints($data['outline'],$data['dataset']);
							echo $res;
							break;
							
							
							
							
						case 'pointcloudmeta':
							$res = $dbHelper->getPointCloudMeta($data['outline'],$data['dataset']);
							echo $res;
							break;
							
							
						break;	
					}
				} 
				
				
				
				if (!$res) {
					echo 'error';
				} 
				break;
				
			case 'post':
			
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