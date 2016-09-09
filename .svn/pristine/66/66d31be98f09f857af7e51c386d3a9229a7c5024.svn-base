
module.exports = {
	initialize: function() {
		this.$options.rangeSeparator = this.$options.rangeSeparator || ' - ';

		this._$clearButton = this.$el.find('[data-selector=clearDates]');
		this._$startDate = this.$el.find('[data-selector=startDate]');
		this._$endDate = this.$el.find('[data-selector=endDate]');
		this._$dateRange = this.$el.find('[data-selector=dateRange]');

		this._$clearButton.attr('title', this.$options.clearStatus);
	},

	toggleDisabled: function(condition) {
		this._$dateRange.prop('disabled', !condition);
		this.$el.toggleClass('disabled', !condition);
	},

	getDates: function() {
		return {
			startDate: this._$startDate.val(),
			endDate: this._$endDate.val()
		};
	},

	reset: function() {
		if (this.$options.alwaysFilled) {
			this._setDates(new Date(this.$options.defaultStartDate), new Date(this.$options.defaultEndDate));

			return;
		}

		this._setDates(null, null);
	},

	_triggerChange: function() {
		this.$events.trigger('change', this.getDates());
	},

	_dateToString: function(date) {
		return date ? date.toISOString().slice(0, 10) : '';
	},

	_getValidationAttributes: function() {
		var attributes = {};

		attributes['data-val'] = true;
		attributes['data-val-date'] = this.$options.dateMessage;
		attributes['data-date-format'] = this.$options.dateFormat;
		attributes['data-separator'] = this.$options.rangeSeparator;

		if (this.$options.rangeSelect) {
			attributes['data-val-daterange'] = this.$options.daterangeMessage;
		}

		if (this.$options.minDate) {
			attributes['data-val-mindate'] = this.$options.minDateMessage;
			attributes['data-val-mindate-value'] = this.$options.minDate;
		}

		if (this.$options.maxDate) {
			attributes['data-val-maxdate'] = this.$options.maxDateMessage;
			attributes['data-val-maxdate-value'] = this.$options.maxDate;
		}

		if (this.$options.disabledDates) {
			attributes['data-val-disableddates'] = this.$options.disabledDatesMessage;
			attributes['data-val-disableddates-value'] = this.$options.disabledDates;
		}
		if (this.$options.enabledDates) {
			attributes['data-val-enableddates'] = this.$options.disabledDatesMessage;
			attributes['data-val-enableddates-value'] = this.$options.enabledDates;
		}

		if (this.$options.alwaysFilled) {
			attributes['data-val-required'] = this.$options.dateMessage;
		}

		return attributes;
	}
};
