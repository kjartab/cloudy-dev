	
			function loadPointData(data) {
			
				var rgbcolors = [];
				
				var max_x = 0;
				var max_y = 0;
				var max_z = 0;
				
				var geometry = new THREE.Geometry();
				
				geometry.colors = [];
				var colorrange=65535;
				var x,y,z;
				var vertex = new THREE.Vector3();
				for (i = 0; i < data.length; i++ ) {
					
					vertex.x = data[i][0];
					vertex.y = data[i][1];
					vertex.z = data[i][2];
					
					if (i==0) {
						max_x = min_x = Number(vertex.x);
						max_y = min_y = Number(vertex.y);
						max_z = min_z = Number(vertex.z);
						
					} else {
						if (Number(vertex.x) > max_x) {
							max_x = Number(vertex.x);
						} 
						
						if (Number(vertex.x) < min_x) {
							min_x = Number(vertex.x);
						}
						
						if (Number(vertex.y) > max_y) {
							max_y = Number(vertex.y);
						} 
						
						if (Number(vertex.y) < min_y) {
							min_y = Number(vertex.y);
						}
						
						if (Number(vertex.z) > max_z) {
							max_z = Number(vertex.z);
						} 
						
						if (Number(vertex.z) < min_z) {
							min_z = Number(vertex.z);
						}
					}
					
					
					
				}
				
				
				for (i = 0; i < data.length; i++ ) {
					var vertex = new THREE.Vector3();
					
					vertex.x = data[i][0] - min_x - (max_x-min_x)/2;
					vertex.z = data[i][1] - min_y - (max_y-min_y)/2;
					vertex.y = data[i][2] - min_z - (max_z-min_z)/2;
					
					geometry.colors[i] = new THREE.Color();
					rgbcolors[i] = new THREE.Color();
                    var r,g,b;
                    
					 switch(Number(data[i][3])) {
                         
                         case 1:
                             r = 255, g=255, b=255;
                             break;
                         case 2:
                             r = 0; g=255; b=255;                         
                             break;
                         case 3:
                            r = 255, g=0, b=255;
                            break;
                         case 4:
                             r = 255; 
                             g=255;
                             b=0;
                             break;
                         case 5:
                             r = 55;
                             g=55;
                             b=55;
                             break;
                         case 6:
                             r = 255; g=0; b=0
                             break;
                         case 7:
                             r = 0, g=0, b=255;
                             break;
                         case 8:
                            r = 255, g=255, b=255;
                            break;
                     }
					geometry.colors[i].setRGB(r,g,b);
					rgbcolors[i].setRGB(r,g,b);
					
					geometry.vertices.push( vertex );
					
				}
				
				var material = new THREE.ParticleBasicMaterial( {
					size: 0.05,
					vertexColors: true
				} );
				
				
				//return the geometry
				return new THREE.ParticleSystem(geometry, material);;
			}
			
			
			
