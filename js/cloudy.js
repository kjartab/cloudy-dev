
function Cloud(map) {

	_map = map;
	
	_drawnItems = new L.FeatureGroup();
	_map.addLayer(_drawnItems);
	
	_map.on('layeradd', function(e) {
		
	});
	
	_drawControl = new L.Control.Draw({
			edit: { 
				featureGroup: _drawnItems
			},
			position: 'bottomright'
		});
	_map.addControl(_drawControl);
	
	_map.on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;

			if (type === 'marker') {
			//	K.startViewer(K.toWKT(e.layer),-1,'buffer',-1);
			}
			
			if (type === 'rectangle' || type === 'polygon') {

			//	K.startViewer(K.toWKT(e.layer),-1,'polygon',-1);
			}
			
			if (type === 'circle') {
			//	K.startViewer(K.toWKT(e.layer),-1,'circle',layer._mRadius);
				
			}
			startViewer(toWKT(layer),'dklidar');

			_map.addLayer(layer);
		});
	
}

function style() {
	return {	
		weight: 6,
		fillColor: '#333333',
		color: '#333333',
		fillOpacity: 0.7
	}
}

function getCloud() {
	return cloudy;
}


function addToList(listdiv, name, dbid) {
	
	var anchor = document.createElement("a");
	anchor.className+=" list-group-item";
	anchor.innerHTML = name;
	anchor.dbid = dbid;
	anchor.onclick = function() { getCloud().getLeafletObject(dbid) };
	listdiv.append(anchor);
}


function style(feature) {
		switch(feature.geometry.type) {
			case 'Polygon':
				return {
					fillColor: "#333333",
					weight: 1,
					opacity: 1,
					color: "#2233dd",
					fillOpacity: 0.3
				};
			break;
			
			case 'Point':
				return {
					fillColor: "#2233dd",
					weight: 1,
					opacity: 0.8,
					color: "#2233dd",
					fillOpacity: 0.9
				};
			break;
		}
	}
	

function onEachFeature(feature, layer) {
		
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
		
	}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function resetHighlight(e) {
		map.geojson.resetStyle(e.target);
	}



function highlightFeature(e) {
	activePolygon = e.target.feature;
	console.log(activePolygon);

		var layer = e.target;
		switch(layer.feature.geometry.type) {
			case 'Polygon':
				layer.setStyle({
					weight: 1,
					fillColor: "#0A0AD1",
					color: "#3366CC",
					fillOpacity: 0.3
				});
			break;
			
			case 'Point':
				layer.setStyle({
				weight: 4,
				fillColor: "#0A0AD1",
				color: "#3366CC",
				fillOpacity: 0.7
			});
			break;
			
			
		}
		

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	
function startViewer(outline, dataset) {
		if(outline != null) {
			open("viewer.html?outline="+outline+"&dataset="+dataset);
		} else {
			window.alert("No point cloud selected");
		}
	}
	
function toWKT(layer) {
		var lng, lat, coords = [];
		
		if (layer instanceof L.Polygon || layer instanceof L.Polyline ) {
			var latlngs = layer.getLatLngs();
			for (var i = 0; i < latlngs.length; i++) {
				latlngs[i]
				coords.push(latlngs[i].lng + " " + latlngs[i].lat);
				if (i === 0) {
					lng = latlngs[i].lng;
					lat = latlngs[i].lat;
				}
			};
			if (layer instanceof L.Polygon) {
				return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
			} else if (layer instanceof L.Polyline) {
				return "LINESTRING(" + coords.join(",") + ")";
			}
		} else if (layer instanceof L.Circle) {
			return "ST_MakePoint(" + layer.getLatLng().lng + "," + layer.getLatLng().lat + ")";
		} else if (layer instanceof L.Marker) {
			return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
		}
	}