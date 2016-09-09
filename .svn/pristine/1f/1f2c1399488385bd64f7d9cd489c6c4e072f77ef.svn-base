var CLASSES = {
	withoutPagination: 'data-table--without-pagination'
};

/**
  name: Datatables pagable
  type: ui
  desc: >
		Shows or hides table pagination based on number of pages by adding/removing `data-table--without-pagination` class.
		Currently, pagination if hidden if there is only one page
*/
module.exports = {
	initialize: function() {
		this.$events.on('apiReady', this._apiReady.bind(this));
		this.$events.on('ajax', this._hidePagination.bind(this));
		this.$events.on('drawed', this._onDraw.bind(this));
	},

	_hidePagination: function() {
		this.$el.addClass(CLASSES.withoutPagination);
	},

	_showPagination: function() {
		this.$el.removeClass(CLASSES.withoutPagination);
	},

	_onDraw: function() {
		var count = this.api.dataTablesAPI.page.info().pages;

		if (count < 2) {
			this._hidePagination();

			return;
		}

		this._showPagination();
	},

	_apiReady: function($ev, api) {
		this.api = api;
	}
};
