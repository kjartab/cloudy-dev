// Extends Leaflet and adds functionality for map-dom interaction

var K = {
	version: '0.1-dev',
	}
	
	// Constructs a map and binds it to the incoming DOM object, divelement
	K.addMap = function(divelement) {
		K.map = L.map(divelement).setView([56.9648487562327, 1.8675290264099], 17);
		
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(K.getMap());
		
		K.drawnItems = new L.FeatureGroup();
		K.getMap().addLayer(K.drawnItems);

		K.drawControl = new L.Control.Draw({
			edit: { 
				featureGroup: K.drawnItems
			},
			position: 'bottomright'
		});
		K.getMap().addControl(K.drawControl);
		
		
		K.getMap().on('draw:created', function (e) {
			var type = e.layerType,
				layer = e.layer;

			if (type === 'marker') {
				K.startViewer(K.toWKT(e.layer),-1,'buffer',-1);
			}
			
			if (type === 'rectangle' || type === 'polygon') {
				K.startViewer(K.toWKT(e.layer),-1,'polygon',-1);
			}
			
			if (type === 'circle') {
				K.startViewer(K.toWKT(e.layer),-1,'circle',layer._mRadius);
				
			}
			
			K.getMap().addLayer(layer);
		});
		
	}
	
	
	K.getMap = function() {
		return K.map;
	}
	
	
	K.addGeoJsonLayer = function() {
		K.geoJsonLayer =  L.geoJson(null,{onEachFeature: K.onEachFeature, style : K.style}).addTo(K.map);
		return K.geoJsonLayer;	
	}	
	
	
	K.addData = function(data) {
		console.log(data[3]);		
		K.geoJsonLayer.addData(JSON.parse(data[3]));
		return K.geoJsonLayer;
	}
	
	
	K.onEachFeature = function(feature, layer) {
		
		layer.on({
			mouseover: K.highlightFeature,
			mouseout: K.resetHighlight,
			click: K.zoomToFeature
		});
		
	}
	
	
	K.highlightFeature = function(e) {
		K.setActivePolygon(e);
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

	
	K.resetHighlight = function(e) {
		K.geoJsonLayer.resetStyle(e.target);
		K.activePolygon = '';
	}
	
	K.setActivePolygon = function(e) {
		K.activePolygon = e.target;
		console.log('Active polygon:');
		console.log(e);
	}
	
	K.getActivePolygon = function() {
		return K.activePolygon;
	}
	

	K.style = function(feature) {
		switch(feature.geometry.type) {
			case 'Polygon':
				return {
					fillColor: "#2233dd",
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
	
	
	K.zoomToFeature = function(e) {
		K.getMap().fitBounds(e.target.getBounds());
	}
	
	K.startViewer = function(outline, id, option, extra) {
		if(outline != null) {
			console.log(extra);
			open("viewer.html?outline="+outline+"&id="+id+"&option="+option+"&extra="+extra);
		} else {
			window.alert("No point cloud selected");
		}
	}
	
    K.toWKT = function(layer) {
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

