var loaderTemplate = require('./_html/loader-overlay.html');
var busyModeClass = 'loader--busy-mode';

/**
	name: Loader
	type: ui
	desc: >
		Show overlay with Loader when loaded state is activated
		Works as additional extension on component.
		To turn it on/off just trigger specific event in your component:

		`busy-mode-on` - to turn on
		`busy-mode-off` - to turn off

		Just like this `this.$events.trigger('busy-mode-on');`
*/
module.exports = {
	initialize: function() {
		this.$events.on('busy-mode-on', this.turnOn.bind(this));
		this.$events.on('busy-mode-off', this.turnOff.bind(this));
		this.$el.append(loaderTemplate);

		if(this.$options.autostart){
			this.turnOn();
		}
	},

	/**
		desc: Show loader overlay
	 */
	turnOn: function() {
		this.$el.addClass(busyModeClass);
	},

	/**
		desc: Hide loader overlay
	 */
	turnOff: function() {
		this.$el.removeClass(busyModeClass);
	}
};
