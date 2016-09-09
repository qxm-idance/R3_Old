/**
  name: Datatables filters form
  type: ui
  desc: >
    Gathers filters value for our datatables
*/

module.exports = {
	events: {
		'filterChanged $$filters': '_change'
	},

	initialize: function() {
		this._lastFilter = null;
	},

	/**
		desc: Returns name of last filter which was changed
		*/
	getLast: function() {
		return this._lastFilter;
	},

	/**
		desc: Sets table api for filters
		*/
	setApi: function(api) {
		this.api = api;

		this.$components.filters.forEach(function(filter) {
			filter.$events.trigger('apiReady', api);
		});
	},

	/**
		desc: Returns filter values
		*/
	values: function() {
		var result = [];

		this.$components.filters.forEach(function(filter) {
			var filterValue = filter.filters();

			if (!filterValue) {
				return;
			}

			result.push.apply(result, filterValue);
		});

		return result;
	},

	/**
		desc: Returns if filter inputs is valid
		*/
	isValid: function() {
		return this.$extensions.form.valid();
	},

	_change: function($ev) {
		var filter = $ev.data.component;

		this._lastFilter = filter.$options.column;

		this.api.search();
	}
};
