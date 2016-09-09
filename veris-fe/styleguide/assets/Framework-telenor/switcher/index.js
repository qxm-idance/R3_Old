var SELECTORS = {
	firstOption: '[data-selector="first-option"]',
	secondOption: '[data-selector="second-option"]',
	checked: 'input:checked'
};

var ATTRIBUTES = {
	loading: 'data-loading',
	checked: 'checked',
	disabled: 'disabled'
};

/**
	name: Switcher
	type: ui
	desc: Implementation of toggle component with two states.
	options:
		loading: Adds activity indication.
	events:
		change: Fires when current state was changed. Passes new value as argument.
*/
module.exports = {
	events: {
		'change': '_onValueChange'
	},

	/**
	 desc: Enables loading state and returns promise to resolve activity process.
	 */
	activityIndicator: function() {
		var dfd = this.$tools.q.defer();

		this.setLoading();

		dfd.finally(this.resetLoading.bind(this));

		return dfd;
	},

	/**
	 desc: Sets component to loading state.
	 */
	setLoading: function() {
		this.$el.attr(ATTRIBUTES.loading, true);
	},

	/**
	 desc: Resets component to default state.
	 */
	resetLoading: function() {
		this.$el.removeAttr(ATTRIBUTES.loading);
	},

	/**
	 desc: Gets value of currently selected option.
	 */
	getValue: function() {
		return this.$el.find(SELECTORS.checked).val();
	},

	/**
		desc: Return true if switcher is checked, false - in other case.
		*/
	isChecked: function() {
		return this.$el.find(SELECTORS.firstOption).prop(ATTRIBUTES.checked);
	},

	/**
	 desc: Sets new value.
	 args:
	    value: Boolean. Value to set. Pass `true` to select first option and `false` for second.
	 */
	setValue: function(value) {
		this.$el.find(SELECTORS.firstOption).prop(ATTRIBUTES.checked, value);
		this.$el.find(SELECTORS.secondOption).prop(ATTRIBUTES.checked, !value);

		this._onValueChange();
	},

	/**
	 desc: return name of the inputs
	 */
	getName: function() {
		return this.$el.find(SELECTORS.firstOption).prop('name');
	},

	/**
		desc: Set switcher as enabled
	 */
	enable: function() {
		this.$el.find(SELECTORS.checked).removeAttr(ATTRIBUTES.disabled);
	},

	/**
		desc: Set switcher as disabled
	 */
	disable: function() {
		this.$el.find(SELECTORS.checked).attr(ATTRIBUTES.disabled, ATTRIBUTES.disabled);
	},

	/**
		desc: Check switcher is enabled or disabled
		*/
	isEnabled: function() {
		return !this.$el.find(SELECTORS.checked).is('[' + ATTRIBUTES.disabled + ']');
	},

	_onValueChange: function() {
		this.$events.trigger('change', this.getValue());
	}
};
