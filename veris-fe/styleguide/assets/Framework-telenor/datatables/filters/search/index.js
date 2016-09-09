/**
  name: Datatables search filter
  type: ui
  desc: >
    Filters table based on input value
  options:
    column:
      Column index to filter against
*/
module.exports = {
	initialize: function() {
		this.$events.on('search', this._search.bind(this));
	},

	/**
		desc: Standard method for getting filter value.
		*/
	filters: function() {
		if (!this.term) {
			return false;
		}

		return [{
			"type": "containce",
			"name": this.$options.column,
			"value": this.term
		}];
	},

	_search: function(_e, term) {
		this.term = term;

		this.$events.trigger('filterChanged');
	}
};
