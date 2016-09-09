/**
  name: Datatables checkbox filter
  type: ui
  desc: >
    Filters table based on checked value
  options:
    column:
      Column index to filter against
*/
module.exports = {
	initialize: function() {
		this.$events.on('changed', this._changed.bind(this));
	},

	/**
	 desc: Standard method for getting filter value.
	 */
	filters: function() {
		return [{
			"type": "equal",
			"name": this.$options.column,
			"value": this.$extensions.checkbox.isChecked()
		}];
	},

	_changed: function() {
		this.$events.trigger('filterChanged');
	}
};
