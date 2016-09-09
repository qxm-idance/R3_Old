/**
 name: Form validation
 type: ui
 desc: >
 Validates form using .net validation attributtes.

 Component should not be used directly, but form extension.
 */
var VALIDATION_MESSAGE_FOR = 'VALIDATION_MESSAGE_FOR';
var VALIDATION_MESSAGE_FOR_SEPARATOR = '-';
var adapters = require('./adapters');
var _methods = require('./methods');

module.exports = {
	initialize: function() {
		this.options = this.$tools.util.extend({
			errorClass: "input-validation-error",
			errorElement: "span",
			errorPlacement: this._onError.bind(this),
			invalidHandler: this._onErrors.bind(this),
			messages: {},
			rules: {},
			success: this._onSuccess.bind(this),
			focusCleanup: true
		}, this.$options);
	},

	ready: function() {
		this._fields = this.$el.find(":input[data-val=true]").get();

		this._fields.forEach(this._prepareValidation, this);

		this.$el.find('.field-validation-error').get().forEach(this._showDefaultError, this);

		this.$el.validate(this.options);

		this.$events.on('formReset', this._resetValidation.bind(this));
		this.$events.on('customError', this._onCustomError.bind(this));
	},

	_resetValidation: function() {
		this._fields.forEach(this._hideError, this);
	},

	_onError: function($errorElement, $input) {
		this._showError($input[0], $errorElement.text());
	},

	_showDefaultError: function(field) {
		if (field.previousElementSibling.classList.contains('input-validation-error')) {
			this._showError(field.previousElementSibling, field.textContent);
		}
	},

	_showError: function(input, errorMessage) {
		var alias = [VALIDATION_MESSAGE_FOR, input.name].join(VALIDATION_MESSAGE_FOR_SEPARATOR);
		var tooltip = this.$elements[alias];

		if (!tooltip) {
			this.$tools.logger.error('Tooltip for element "' + input.name + '"" is unavailable.');
		} else if (tooltip.length > 1) {
			this.$tools.logger.error('Tooltip for element "' + input.name + '"" is duplicated.');
		} else {
			tooltip.data('$component').text(errorMessage);
		}

		input.parentNode.classList.add('form-item--error');
	},

	_onErrors: function() {},

	_onSuccess: function($errorElement, input) {
		this._hideError(input);
	},

	_hideError: function(input) {
		input.parentNode.classList.remove('form-item--error');
	},

	_prepareValidation: function(input) {
		this.options.rules[input.name] = {};
		this.options.messages[input.name] = {};

		adapters.forEach(function(adapter) {
			var prefix = "data-val-" + adapter.name;
			var paramValues = {};

			if (!input.hasAttribute(prefix)) {
				return;
			}

			adapter.params.forEach(function(param) {
				paramValues[param] = input.getAttribute(prefix + '-' + param) || undefined;
			});

			adapter.adapt({
				element: input,
				form: this.$el.get(0),
				message: input.getAttribute(prefix),
				params: paramValues,
				rules: this.options.rules[input.name],
				messages: this.options.messages[input.name]
			});
		}, this);
	},

	_onCustomError: function(event, data) {
		this._showError(data.input, data.message);
	}
};
