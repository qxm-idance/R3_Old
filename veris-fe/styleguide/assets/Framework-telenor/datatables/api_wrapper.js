var ApiWrapper = module.exports = function(dataTablesAPI) {
	this.dataTablesAPI = dataTablesAPI;
};

ApiWrapper.prototype.search = function() {
	this.dataTablesAPI.draw();
};

ApiWrapper.prototype.columns = function() {
	var dataTablesAPI = this.dataTablesAPI;

	return dataTablesAPI.columns()[0].map(function(columnIndex) {
		return {
			index: columnIndex,
			title: dataTablesAPI.column(columnIndex).header().textContent,
			visible: dataTablesAPI.column(columnIndex).visible,
			show: function() {
				dataTablesAPI.column(columnIndex).visible(true)
			},
			hide: function() {
				dataTablesAPI.column(columnIndex).visible(false)
			},
		}
	}, this);
};