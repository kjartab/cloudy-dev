// Extends Leaflet and adds functionality for map-dom interaction
function Cloud(divelement) {

	version: '0.1',
	map = L.map(divelement).setView([56.9648487562327, 1.8675290264099], 14);
	map.addLayer(L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}));
	
	
	geojson = L.geoJson(null,{onEachFeature: this.onEachFeature, style : this.style}).addTo(map);
	
	drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);
	
	map.on('layeradd', function(e) {
	
	});
	
	drawControl = new L.Control.Draw({
			edit: { 
				featureGroup: drawnItems
			},
			position: 'bottomright'
		});
	map.addControl(drawControl);
	
	map.on('draw:created', function (e) {
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
			
			map.addLayer(layer);
		});
	
}

	Cloud.prototype.addMapObject = function(item, list) {
		
		this.addGeoJson(item);
		this.addToList(list, item.props.name, item.props.dbid);
	}
	
	Cloud.prototype.addGeoJson = function(jsonobject) {	
		geojson.addData(jsonobject);
	}
	
	function getLeafletObject(dbid) {
		geojson.eachLayer(function (layer) {
			if (getLeafletDbId(layer) == dbid) {
				layer.setStyle({
					weight: 6,
					fillColor: '#333333',
					color: '#333333',
					fillOpacity: 0.7
				});
				map.panTo(layer.getBounds().getCenter(), {animate : true, duration: 0.5});
			}
			
		});
		
		
	}

	function getLeafletDbId(leafletobj) {
		return leafletobj.feature.geometry.props.dbid;
	}
	
	
	Cloud.prototype.addToList = function(listdiv, name, dbid) {
		var anchor = document.createElement("a");
		anchor.className+=" list-group-item";
		anchor.innerHTML = name;
		anchor.dbid = dbid;
			anchor.onclick = function() {getLeafletObject(dbid)};
		listdiv.append(anchor);

	}

    
	
