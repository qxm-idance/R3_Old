/**
name: Number
type: ui
desc: Implementation of `<input type="number">`. Contains pretty buttons that change current value by specified `step`.
options:
	min: Minimum value.
	max: Maximum value.
	step: Specifies step to increase/decrease current value by click on buttons.
	allow-decimal: if true then user is allowed to input decimal fractions
events:
	change. Fires when value was decreased/increased.
 */
module.exports = {
	initialize: function() {
		var buttonsHtml = require('./html/buttons.html');

		var newValue = this.$el.find("input").val();
		if (!newValue) {
			newValue = this.$tools.helper.isNumber(this.$options.min) ? this.$options.min : 1;
		}

		this.$el.append(buttonsHtml);
		this._setValue(newValue);
	},
	events: {
		"click button": '_clickHandler',
		"keypress input": '_keypressHandler',
		"change input": '_inputHandler'
	},
	/**
	 desc: Gets or sets current value.
	 args:
	    newValue: Number. Value to set as current.
	 */
	val: function(newValue) {
		if (typeof newValue === "undefined") {
			return this.$el.find('input').val();
		} else {
			this._setValue(newValue);
			return this;
		}
	},
	/**
	 desc: Disables all controls.
	 */
	disable: function() {
		this.$el.find('button,input').prop('disabled', true);
	},
	/**
	 desc: Enables all controls.
	 */
	enable: function() {
		this.$el.find('button,input').prop('disabled', false);
	},
	_setValue: function(newValue) {
		if (this.$tools.helper.isNumber(this.$options.max) && newValue > this.$options.max) {
			this.$events.trigger('max-limit-exceeded', newValue);
			newValue = this.$options.max;
		}

		if (this.$tools.helper.isNumber(this.$options.min) && newValue < this.$options.min) {
			this.$events.trigger('min-limit-exceeded', newValue);
			newValue = this.$options.min;
		}

		this.$el.find('input').val(newValue);
		this.$events.trigger('change', newValue);
	},
	_clickHandler: function(e) {
		var $button = this.$el.find(e.target);
		var oldValue = this.$el.find('input').val();
		var newValue = parseFloat(oldValue, 10) + (($button.hasClass('number__control--increase')) ? 1 : -1) * (this.$options.step || 1);

		this._setValue(newValue);
		e.preventDefault();
	},
	_inputHandler: function(e) {
		var newValue = this.$el.find('input').val();
		this._setValue(newValue);
	},
	_keypressHandler: function(e) {
		// ignore non-numeric chars if no decimals fractions are allowed
		if (this.$options.allowDecimal !== true) {
			if (e.which < 48 || e.which > 57) {
				e.preventDefault();
			}
		}
		// otherwise trust the type="number" browser validation for valid
		// numeric value like 3.5 or 3.44E-3
	}
};
