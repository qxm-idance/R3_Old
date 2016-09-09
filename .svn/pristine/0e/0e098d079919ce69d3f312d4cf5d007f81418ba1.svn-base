var defaults = {
	captureLength: 1,
	delay: 500
};
/**
name: Typewatch
desc: Watch the user input and emit typeWatch event on type
events:
	typeWatch: fires when user type

*/

module.exports = {
	events: {
		'input': '_onInput'
	},

	initialize: function() {
		this.$options = this.$tools.helper.extend({}, defaults, this.$options);
		this.debouncedInputHandler = this.$tools.helper.debounce(function(value) {
			this.$events.trigger('typeWatch', value);
			this.$el.$events.trigger('typeWatch', value);
		}.bind(this), this.$options.delay);
	},

	_onInput: function() {
		var value = this._getValue();

		if (value.length >= this.$options.captureLength) {
			this.debouncedInputHandler(value);
		}
	},

	_getValue: function() {
		return this.$el.val() || '';
	}
};
