
		var geojson;
		var idmap;
		var segmenttrack;
		
		
		
		function hoverTrackElement(track_id) {
		
			var segment_ids = getSegments(track_id);
			var bounds = getTrackBounds(segment_ids);
			
			highlightSegments(segment_ids);

		}
		
		function highlightSegments(segment_ids) {
			
				geojson.eachLayer(function (layer) {
					var id = layer._leaflet_id;
					for (i=0; i<segment_ids.length; i++) {
						if(segment_ids[i] == layer.feature.properties.sid) {
						
						map._layers[id].setStyle(
							{
							color: getAgeColor(layer.feature), 
							weight: 7
							}).bringToFront();
						}
					}
						
				});
			
		}
		
			
			function clickOnTrackElement(track_id) {
				var segment_ids = getSegments(track_id);
				var bounds = getTrackBounds(segment_ids);
				highlightSegments(segment_ids);
			}
			
			function addSegments(data) {
			
				geojson = L.geoJson(data, {
					style: style,
					onEachFeature: onEachFeature,
					
				}).addTo(map);
				console.log(data);
				idMapping();
			}
			
			function getFullExtent() {
				
			
			}

			
			function getTrackBounds(segment_ids) {
				
				var bounds = [];
				for (var i=0; i<segment_ids.length; i++) {
					bounds[i] = getSegmentObject(segment_ids[i]).getBounds();
				}
				return new L.LatLngBounds(bounds);
			}
			
			function cleanMap() {
				resetAllStyles();
			}
			
			function getSegments(track_id) {
				var segment_ids = [];
				var count = 0;
				for (var i=0; i<segmenttrack.length; i++) {
					if (segmenttrack[i].track_id==track_id) {
						segment_ids[count] = segmenttrack[i].segment_id;
						count++;
					}				
				}
				return segment_ids;
			}
			
		
		
			
			// Maps the segment ID to the feature ID
			function idMapping() {
				var sid;
				var tid;
				idmap = new Array();
				for (var key in geojson._layers) {
					sid = geojson._layers[key].feature.properties.sid;
					idmap[Number(key)] = [sid, Number(key)];
				}
				
			}
			
			function onMapClick(e) {
				console.log(e);
			}
			
			function onEachFeature(feature, layer) {
				
				layer.on({
					mouseover: highlightFeature,
					mouseout: resetHighlight,
					click: zoomToFeature
				});
			}
			
			function getTrackDayAge(timeStamp) {
				return new Date()-timeStamp;
			}
			
			function getAgeColour(age) {
			
				if (age<1) {
					return "#3ABA58";
				}
				if (age<3) {
					return "#3ABAA9";
				}
				if (age<5) {
					return "#3A63BA";
				}
				if (age<7) {
					return "#693ABA";
				}
				if (age<10) {
					return "#BA3A5E";
				}
				if (age<14) {
					return "#FF0000";
				}
				
				return "#000000";
					
			}
			
						
			function getAgeColor(feature) {
				var day=new Date(feature.properties.starttime.replace(' ','T')+'Z');
				return getAgeColour(getTrackDayAge(day)/86400000);
			}
			
		
			function style(feature) {
			
				return {
					fillColor: getAgeColor(feature),
					weight: 3,
					opacity: 1,
					color: getAgeColor(feature),
					fillOpacity: 0.6
				};
				
			}
					
			function highlightFeature(e) {
				console.log(e);
				var object = e.target;
				object.setStyle({
					weight: 6,
					fillColor: object.options.fillColor,
					color: object.options.color,
					fillOpacity: 0.7
				});

				if (!L.Browser.ie && !L.Browser.opera) {
					object.bringToFront();
				}
			}
	
			
			function getRandomColor() {
				var letters = '0123456789ABCDEF'.split('');
				var color = '#';
				for (var i = 0; i < 6; i++ ) {
					color += letters[Math.round(Math.random() * 15)];
				}
				return color;
			}
		

		
			function resetHighlight(e) {
			
				geojson.resetStyle(e.target);
				
			}
			
			function resetAllStyles() {
			
				for(var layer in geojson._layers) {
					geojson.resetStyle(geojson._layers[layer]);
				}
				
			}

			function zoomToFeature(e) {
			
				map.fitBounds(e.target.getBounds());
				
			}
			
			
			function zoomToTrack(min_east, min_north, max_north, max_east) {
				
				var southWest = new L.LatLng(min_north, min_east),
				northEast = new L.LatLng(max_north, max_east),
				bounds = new L.LatLngBounds(southWest, northEast);
				map.fitBounds(bounds);
				
			}
			
			function getLeafletId(sid) {
			
				for (var kv in idmap) {					
					if (sid == idmap[kv][0]) {
						return idmap[kv][1];
					}
				}
				return -1;
			}

			function getSegmentObject(segment_id) {
			
				return geojson._layers[getLeafletId(segment_id)];
				
			}

    