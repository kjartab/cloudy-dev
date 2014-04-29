// Extends Leaflet and adds functionality for map-dom interaction

var K = {
	version: '0.1-dev',
	}
	

	K.addMap = function(divelement) {
		
		K.map = L.map(divelement, {drawControl: true}).setView([62.00, 10.00], 5);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(K.map);
	}
	
	
	K.getMap = function() {
		return K.map;
	}
	
	
	K.addGeoJsonLayer = function() {
		K.geoJsonLayer =  L.geoJson(null,{onEachFeature: K.onEachFeature, style : K.style}).addTo(K.map);
		return K.geoJsonLayer;
	}	
	
	
	K.addData = function(data) {
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
			weight: 8,
			opacity: 0.8,
			color: "#2233dd",
			fillOpacity: 0.9
		};
	}
	
	K.zoomToFeature = function(e) {
		K.getMap().fitBounds(e.target.getBounds());
	}
	
		

	

