var carousel = require('Framework/carousel');
/**
name: Desktop carousel
type: ui
desc: >
    Implementation of component for desktop carousel.
    Activate carousel only on desktop.
 */
module.exports = app.core.util.extend({}, carousel, {
	ready: function() {
		if (window.innerWidth > 761) {
			this.activate();
		}
	}
})
