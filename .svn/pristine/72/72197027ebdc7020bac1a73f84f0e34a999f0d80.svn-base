/**
	name: Range slider
	type: ui
	desc: Creates select for slider
 */

module.exports = {
	/**
		desc: return total count of options
	 */
	getLength: function() {
		return this.$el.find('option').length;
	},

	_getOption: function(index) {
		return this.$el.find('option').eq(index);
	},

	/**
		desc: return value of option by index
		args:
			index: index from which need get value
	 */
	getValue: function(index) {
		return this._getOption(index).val();
	},

	/**
		desc: return current selected value
	 */
	value: function() {
		return this.$el.find('option:selected').index();
	},

	/**
		desc: get index of option by value
		args:
			value: value of option
	 */
	getIndex: function(value) {
		return this.$el.find('option[value="' + value + '"]').index();
	},

	/**
		desc: return tooltip of option by index
		args:
			index: option index
	 */
	getTooltip: function(index) {
		return this._getOption(index).data('tooltip') || this.getValue();
	},

	/**
		desc: set value by option index
		args:
			index: option index
	 */
	setValue: function(index) {
		var option = this._getOption(index);

		if (option.prop('selected')) {
			return;
		}

		option.prop('selected', true);

		this.$el.find('select').trigger('change');
	}
};
