var $ = require('jquery');
var datepick = require('./../../jquery.datepick');

/**
 * Creates an instance of Datepicker test object
 *
 * @param {Aura} component - Framework::datepicker component initialized on the page
 *
 * @constructor
 */
function Datepicker(component) {
	var $el = component.$el;
	var $input = $el.find('.form--daterange__range');

	this.$el = $el;

	this.openPopup = function() {
		$el.click();

		this.refresh();
	};

	this.refresh = function() {
		this.popup = new Popup($('.datepick-popup'));
	};

	this.hasPopup = function() {
		return !!this.popup && this.popup.isVisible();
	};

	this.getValue = function() {
		return $input.val();
	};

	this.setValue = function(value) {
		$input.val(value);
	};
}

/**
 * Creates an instance of Popup test object
 *
 * @param {jQuery} $el - element containing datepicker popup
 *
 * @constructor
 */
function Popup($el) {
	var $closeButton = $el.find('.datepick-cmd-close');

	this.$el = $el;

	/**
	 * Checks if popup is currently opened
	 *
	 * @returns {boolean}
	 */
	this.isVisible = function() {
		return !!$el.parent()[0];
	};

	/**
	 * Closes popup
	 */
	this.close = function() {
		$closeButton.click();
	};

	/**
	 * Returns an element representing given date
	 *
	 * @param {string} dateString - Date to be selected 'yyyy-mm-dd'
	 */
	this.getDateElement = function(dateString) {
		var date = datepick.parseDate('yyyy-mm-dd', dateString);

		return $el.find('.dp' + (+date));
	};

	this.getSelectedDateElement = function() {
		return $el.find('.datepick-selected');
	};

	this.getTodayElement = function() {
		return $el.find('.datepick-today');
	};

	this.getFirstMonthHeader = function() {
		return $el.find('.datepick-month.first .datepick-month-header');
	};

	this.getLastMonthHeader = function() {
		return $el.find('.datepick-month.last .datepick-month-header');
	};

	this.getPrevButton = function() {
		return $el.find('.datepick-cmd-prev');
	};

	this.getNextButton = function() {
		return $el.find('.datepick-cmd-next');
	};

	this.getApplyButton = function() {
		return $el.find('.datepick-ctrl .button--action');
	}
}

module.exports = Datepicker;
