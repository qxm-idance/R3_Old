/**
  name: Datatables date range filter
  type: ui
  desc: >
    Filters table based on date range
  options:
    column:
      Column index to filter against
*/
module.exports = {
	initialize: function() {
		this.$events.on('change', this._filter.bind(this));
	},

	/**
		desc: Standard method for getting filter value.
		*/
	filters: function() {
		if (!this.dates || (!this.dates.startDate.length && !this.dates.endDate.length)) {
			return false;
		}

		return [{
			"type": "date",
			"name": this.$options.column,
			"value": this._formatDate(new Date(this.dates.startDate)) + ' - ' + this._formatDate(new Date(this.dates.endDate))
		}];
	},

	_filter: function(e, dates) {
		this.dates = dates;

		this.$events.trigger('filterChanged');
	},

	_formatNum: function(num) {
		return num > 9 ? num : '0' + num;
	},

	_formatDate: function(date) {
		return '' + date.getFullYear() + this._formatNum(date.getMonth() + 1) + this._formatNum(date.getDate()) + 
			this._formatNum(date.getHours()) + this._formatNum(date.getMinutes()) + this._formatNum(date.getSeconds());
	}
};
