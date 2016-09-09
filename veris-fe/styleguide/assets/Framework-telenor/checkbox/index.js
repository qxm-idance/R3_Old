/**
name: Form checkbox
type: ui
desc: Wrapper for native checkbox
events:
	changed: Fires when checkbox state was changed. Passes current state to event handler.
	checked: Fires when checkbox state was changed and current state is checked.
	unchecked: Fires when checkbox state was changed and current state is unchecked.
 */
module.exports = {
	events: {
		'change': '_changeHanlder'
	},

	/**
		desc: Sets state of checkbox to "checked"
	 */
	check: function() {
		this.toggle(true);
	},

	/**
	 desc: Sets state of checkbox to "unchecked"
	 */
	uncheck: function() {
		this.toggle(false);
	},

    
     /**
	 desc: Sets state to one given as argument or to opposite to current one.
	 args:
	    checked: Boolean state to be set or empty to toggle current state.
	 */
	toggle: function(checked) {
		var currentState = this.isChecked();
		var newState = arguments.length ? Boolean(checked) : !currentState;

		if (newState === currentState) {
			return;
		}

		this.$el.prop('checked', newState);

		this._changeHanlder();
	},

	/**
        desc: Checks state of checkbox. Returns `Boolean` value.
	 */
	isChecked: function() {
		return this.$el.prop('checked');
	},

	/**
		desc: Gets checkbox value.
	*/
	value: function() {
		return this.$el.val();
	},

	/**
		desc: return checkbox name
	 */
	name: function() {
		return this.$el.prop('name');
	},

	/**
		desc: Disables checkbox.
	 */
	disable: function() {
		this.$el.prop('disabled', true);
	},

	/**
		desc: Enables checkbox.
	 */
	enable: function() {
		this.$el.prop('disabled', false);
	},

	_changeHanlder: function() {
		var checked = this.isChecked();

		this.$events.trigger('changed', checked);

		this.$events.trigger(checked ? 'checked' : 'unchecked');
	}
};
