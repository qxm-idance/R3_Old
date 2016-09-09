var COMPILLED_COMPONENT_TEMPLATE = app.core.template.parse(require('./html/column_filter.html'));
var COMPILLED_ITEM_TEMPLATE = app.core.template.parse(require('./html/column_item.html'));

/**
  name: Datatables column picker
  type: ui
  desc: >
    Column filter, allows to check wich column should be visible/hidden
  options:
  	exclude: comma-separated list of column indexies to exclude from column picker
*/
module.exports = {
	events: {
		'change input[type="checkbox"]': '_checkboxChanged'
	},

	initialize: function() {
		this.columns = [];

		this.$events.on('apiReady', this._apiReady.bind(this));
	},

	ready: function() {
		this.id = +new Date();
		return this.html(COMPILLED_COMPONENT_TEMPLATE({id: this.id}))
	},

	/**
		desc: Standard method for getting filter value.
		*/
	filters: function() {
		return false;
	},

	/**
		desc: Initialize column from table api object
		*/
	_apiReady: function($ev, api) {
		var $el = this.$tools.dom.find('[data-toggle-target="id_' + this.id + '"] .columns');
		var exclude = (this.$options.exclude || '').split(',').map(function(elem) {
			return parseInt(elem, 10);
		});

		this.columns = api.columns().filter(function(column) {
			if (exclude.indexOf(column.index) === -1) {
				return column;
			}
		});

		this.columns.forEach(function(column) {
			$el.append(COMPILLED_ITEM_TEMPLATE(column));
		});
	},

	_checkboxChanged: function(e) {
		var $el = this.$tools.dom.find(e.currentTarget);
		var checked = $el.is(':checked');
		var columnIndex = parseInt($el.val(), 10);

		this.columns.filter(function(column) {
			return column.index === columnIndex;
		}).forEach(function(column) {
			checked ? column.show() : column.hide();
		});
	}
};
