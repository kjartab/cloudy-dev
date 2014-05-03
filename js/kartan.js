// Extends Leaflet and adds functionality for map-dom interaction

var K = {
	version: '0.1-dev',
	}
	

	K.addMap = function(divelement) {
		
		K.map = L.map(divelement).setView([62.00, 10.00], 5);

		// -------------- Adding draw --------------
				
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(K.getMap());
		
		// Initialise the FeatureGroup to store editable layers
		K.drawnItems = new L.FeatureGroup();
		K.getMap().addLayer(K.drawnItems);

		// Initialise the draw control and pass it the FeatureGroup of editable layers
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
				console.log('marker');
			}
			
			if (type === 'polygon') {
				console.log('polygon');
			}
			
				K.startViewer(K.toWKT(e.layer));
				console.log(K.toWKT(e.layer));

			// Do whatever else you need to. (save to db, add to map etc)
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
		console.log(data);
		K.geoJsonLayer.addData(JSON.parse(data[3]));
	}
	
	
	K.onEachFeature = function(feature, layer) {
		layer.on({
			mouseover: K.highlightFeature,
			mouseout: K.resetHighlight,
			click: K.zoomToFeature
		});
	}
	
	
	K.highlightFeature = function(e) {
				
		var layer = e.target;

		console.log(layer);	
		layer.setStyle({
			weight: 4,
			fillColor: "#0A0AD1",
			color: "#3366CC",
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	
	K.resetHighlight = function(e) {
		K.geoJsonLayer.resetStyle(e.target);
	}
	

	K.style = function(feature) {
		return {
			fillColor: "#2233dd",
			weight: 1,
			opacity: 0.8,
			color: "#2233dd",
			fillOpacity: 0.9
		};
	}
	
	K.zoomToFeature = function(e) {
		K.getMap().fitBounds(e.target.getBounds());
	}
	
	K.startViewer = function(outline) {
		if(outline != null) {
			open("viewer.html?outline="+outline);
		} else {
			window.alert("No point cloud selected");
		}
	}
	
    K.toWKT = function(layer) {
		var lng, lat, coords = [];
		if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
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
		} else if (layer instanceof L.Marker) {
			return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
		}
	}

