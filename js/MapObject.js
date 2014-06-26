	
	function MapDataObject(databaseId, name, leafletObj){
		
		this.databaseId = databaseId,
		this.name = name,
		this.leafletObj = leafletObj
			
	}
	
	MapDataObject.prototype.getName = function() {
		return this.name;
	}
	
	MapDataObject.prototype.getDbId = function() {
		return this.databaseId;
	}
	
	MapDataObject.prototype.getLeafletId = function() {
		return this.leafletObj._leaflet_id;
	}
	
	MapDataObject.prototype.highlightLeafletObj = function() {
		this.leafletObj.highlight();
	}
	
	MapDataObject.prototype.getLeafletObj = function() {
		return this.leafletObj;
	}
	
	MapDataObject.prototype.resetLeafletObj = function() {
		
	}