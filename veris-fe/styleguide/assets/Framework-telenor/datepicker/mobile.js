var tools = require('Common/aura/js/base');
var baseDatepicker = require('./base');

module.exports = tools.util.extend(true, {}, baseDatepicker, {
	events: {
		'change [data-selector=startDate]': '_onChange',
		'change [data-selector=endDate]': '_onChange'
	},

	initialize: function() {
		baseDatepicker.initialize.apply(this, arguments);

		this._$clearButton.remove();
		this._$dateRange.addClass('js-hidden');
	},

	ready: function() {
	this.initializePicker();
	},

	_setDefaults: function() {
		this._setDates(this.$options.defaultStartDate, this.$options.defaultEndDate)
	},

	_setDates: function(startDate, endDate) {
		this._$startDate.val(this._dateToString(startDate));
		this._$endDate.val(this._dateToString(endDate));

		this._change();
	},

	_onChange: function() {
		this._triggerChange();
	},
	initializePicker: function(){
		var attrs = this._getValidationAttributes();

		this._$dateRange.remove();

		this._$startDate
			.attr('type', 'date')
			.removeClass('datepicker__start')
			.val(this.$options.defaultStartDate || '');

		if (this.$options.rangeSelect) {
			this._$endDate
				.attr('type', 'date')
				.removeClass('datepicker__end')
				.val(this.$options.defaultEndDate || '');
		}

		Object.keys(attrs).forEach(function(key) {
			this._$startDate.attr(key, attrs[key]);

			if (this.$options.rangeSelect) {
				this._$endDate.attr(key, attrs[key]);
			}
		}.bind(this));
	}
});
