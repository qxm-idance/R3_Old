var tools = require('Common/aura/js/base');
var baseDatepicker = require('./base');
var Picker = require('./pluginWrapper');

module.exports = tools.util.extend(true, {}, baseDatepicker, {
	events: {
		'click [data-selector=clearDates]': 'reset',
		'changeDate [data-selector=dateRange]': '_pickerChanged'
	},

	ready: function() {
		this.initializePicker();
	},

	initializePicker: function() {
		var attrs = this._getValidationAttributes();

		Object.keys(attrs).forEach(function(key) {
			this._$dateRange.attr(key, attrs[key]);
		}.bind(this));

		if(this._picker) {
			this._picker.destroy();
		}
		this._picker = new Picker(this._$dateRange, this.$options);

		this.reset();
	},

	_setDates: function(startDate, endDate) {
		var currentDates;

		this._picker.setDates(startDate, endDate);

		currentDates = this._picker.getDates();

		if (this.$options.alwaysFilled
			&& !currentDates.startDate
			&& !currentDates.endDate
			&& this.$options.defaultStartDate
		) {
			this.reset();

			return;
		}

		this._updateInputs(this._picker.getDates());

		this._toggleClear();

		this._triggerChange();
	},

	_updateInputs: function(dates) {
		this._$startDate.val(this._dateToString(dates.startDate));
		this._$endDate.val(this._dateToString(dates.endDate));
	},

	_toggleClear: function() {
		var isClearVisible = !(this._isEmpty() || this._isDefault());

		this.toggle('[data-selector=clearDates]', isClearVisible);
	},

	_isDefault: function() {
		var dates = this.getDates();

		return dates.startDate == this.$options.defaultStartDate &&
			dates.endDate == this.$options.defaultEndDate;
	},

	_isEmpty: function() {
		var dates = this.getDates();

		return !(dates.startDate || dates.endDate);
	},

	_isValidDates: function(dates) {
		return this.$options.rangeSelect ? Boolean(dates.startDate) === Boolean(dates.endDate) : true;
	},

	_pickerChanged: function(event) {
		var dates = event.originalEvent.detail || {};

		if (!dates.startDate && !dates.endDate) {
			this.reset();

			return;
		}

		if (!this._isValidDates(dates)) {
			return;
		}

		this._setDates(dates.startDate, dates.endDate);
	}
});
