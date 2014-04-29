
var geometries;
var geojsonLayer;
var idMap = new Array();

function createDataMap() {
	geojsonLayer =  L.geoJson().addTo(map);
}

function addId(leafletId, geometryId) {
	
	idMap.push([leafletId, geometryId]);
	
}

function getLeafletObject(geometryId) {
	console.log(idMap);
	for (var i=0; i<idMap.length; i++) {
		console.log(idMap[i]);
	}
}



function addData(data) {
	var leafletObject = geojsonLayer.addData(JSON.parse(data[3]));
	console.log(leafletObject);
	addId(Number(leafletObject._leaflet_id),Number(data[0]));
	
}

function getAddedLeafletId() {
	for (var id in geojson._layers) {
		id = geojson._layers[id].feature.properties.sid;
	}
}

function zoomToFeature(e) {

	map.fitBounds(e.target.getBounds());
	
}
		
function clickItem(id) {
		console.log(id);
		
		//navigateTo(id);
		//getInfo(id); => dropdown list
}
	

function removeGeometry(leaflet_id) {
	
}

function hideGeometry(geomId) {
	
}

function showGeometry(geomId) {
	
}

function getLeafletId(geomId) {
	
}

function zoomToFeature(e) {

	map.fitBounds(e.target.getBounds());
	
}


function onEachFeature(feature, layer) {
	
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}