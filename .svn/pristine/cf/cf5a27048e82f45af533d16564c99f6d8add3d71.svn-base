'use strict';

var tools = require('Common/aura/js/base');
var utils = require('./utils');
var applyButtonTemplate = require('./_html/apply.html');
var datepick = require('../element/jq-plugins/jquery.datepick');

function PluginWrapper($el, opts) {
	this.$el = $el;

	this._options = {
		alignment: 'bottom',
		disabledClass: 'form-item--disabled',
		showAnim: '',
		changeMonth: false,
		onShow: this._tweakUI.bind(this),
		onClose: this._onDatepickerClose.bind(this)
	};

	tools.util.extend(true, this._options, opts);

	this._options.minDate = this._parseDate(this._options.minDate);
	this._options.maxDate = this._parseDate(this._options.maxDate);
	this._options.defaultStartDate = this._parseDate(this._options.defaultStartDate);
	this._options.defaultEndDate = this._parseDate(this._options.defaultEndDate);

	this._options.dateFormat = utils.dotNetToJs(this._options.dateFormat || '');

	this._options.monthNames = this._options.monthNames.split(',');
	this._options.monthNamesShort = this._options.monthNamesShort.split(',');
	this._options.dayNames = this._options.dayNames.split(',');
	this._options.dayNamesShort = this._options.dayNamesShort.split(',');
	this._options.dayNamesMin = this._options.dayNamesMin.split(',');

	if (this._options.disabledDates) {
		this._options.onDate = function(date) {
			var dateString = date.toISOString().slice(0, 10);

			return {
				selectable: this._options.disabledDates.indexOf(dateString) === -1
			};
		}.bind(this);
	}

	if (this._options.enabledDates) {
		this._options.onDate = function(date) {
			var dateString = date.toISOString().slice(0, 10);

			return {
				selectable: this._options.enabledDates.indexOf(dateString) !== -1
			};
		}.bind(this);
	}

	if (!this._options.rangeSelect) {
		this._options.onSelect = this._triggerValidation.bind(this);
	}


	$el.on('keydown', this._onKeydown.bind(this));
	$el.on('blur', this._onBlur.bind(this));

	$el.datepick(this._options);

	if (this._options.defaultStartDate || this._options.defaultEndDate) {
		this.setDates(this._options.defaultStartDate || this._options.defaultEndDate);
	}

	this._currentValue = this.$el.val();
}

PluginWrapper.prototype.getDates = function() {
	var dateFormat = this._options.dateFormat;
	var inputValue = this.$el.val() || '';

	var dates = this._splitDates(inputValue).map(function(dateString) {
		try {
			return datepick.parseDate(dateFormat, dateString);
		} catch (e) {
			return null;
		}
	});

	return {
		startDate: dates[0],
		endDate: dates[1]
	};
};

PluginWrapper.prototype.setDates = function(startDate, endDate) {
	this.$el.datepick('setDate', startDate, endDate);

	this._currentValue = this.$el.val();
};

PluginWrapper.prototype.show = function() {
	this.$el.datepick('show');
};

PluginWrapper.prototype.hide = function() {
	this.$el.datepick('hide');
};

PluginWrapper.prototype._splitDates = function(datesText) {
	var separator = this._options.rangeSeparator.replace(/\s/g, '')
		.replace(/\-/g, '\\-');
	var rgx = new RegExp('\\s*' + separator + '\\s*', 'g');

	return datesText.split(rgx);
};

PluginWrapper.prototype._parseDate = function(date) {
	return date && new Date(date);
};

PluginWrapper.prototype._tweakUI = function($picker) {
	this._$picker = $picker;

	if ($picker.find('.datepick-month.first .datepick-month-header').length) {
		$picker.find('.datepick-cmd-prev').prependTo('.datepick-month.first .datepick-month-header');
		$picker.find('.datepick-cmd-next').appendTo('.datepick-month.last .datepick-month-header');
	} else {
		$picker.find('.datepick-cmd-prev').prependTo('.datepick-month .datepick-month-header');
		$picker.find('.datepick-cmd-next').appendTo('.datepick-month .datepick-month-header');
	}

	$picker.find('.datepick-cmd-close')
		.click(this.hide.bind(this))
		.prependTo($picker.find('.datepick-nav'));

	if (this._options.rangeSelect) {
		$picker.find('.datepick-ctrl').prepend(applyButtonTemplate);

		$picker.find('[data-selector=applyButton]')
			.text(this._options.applyText)
			.on('click', this._apply.bind(this));
	} else {
		$picker.find('.datepick-ctrl').remove();
	}
};

PluginWrapper.prototype._updateState = function() {
	var value = this.$el.val();

	if (this._currentValue === value) {
		return;
	}

	this._currentValue = value;

	var event = new CustomEvent('changeDate', { 'detail': this.getDates() });
	this.$el[0].dispatchEvent(event);
};

PluginWrapper.prototype._onDatepickerClose = function() {
	/**
	 * Is called when datepicker is closed on any purpose:
	 *  - date was selected
	 *  - apply button was pressed (see _apply)
	 *  - "enter" was pressed (see _onKeydown)
	 *  - input has lost focus (see _onBlur)
	 *  - "close" button was clicked in popup
	 *  - datepicker.hide() method was called directly
	 *
	 * @private
	 */
	this._$picker = null;

	this._updateState();

	// just to remove focus from input after enter
	this.$el.trigger('blur');
};

/**
 * Handles "apply" button click
 *
 * @private
 */
PluginWrapper.prototype._apply = function() {
	this.$el.datepick('apply');
	this._triggerValidation();
};

PluginWrapper.prototype._triggerValidation = function() {
	this.$el.trigger('keyup');
};

PluginWrapper.prototype._onKeydown = function(event) {
	if (event.keyCode !== 13) {
		return;
	}

	// just to remove focus from input after enter
	this.$el.trigger('blur');

	if (this._$picker) {
		// state is updated after close
		this.hide();
	}

	this._updateState();

	// just to remove focus from input after enter
	this.$el.trigger('blur');

	event.stopImmediatePropagation();
	event.preventDefault();
};

PluginWrapper.prototype._onBlur = function(event) {
	// click on datepicker popup
	if (this._$picker) {
		return;
	}

	this._updateState();
};

PluginWrapper.prototype.destroy = function(){
	this.$el.datepick('destroy');
};

module.exports = PluginWrapper;
