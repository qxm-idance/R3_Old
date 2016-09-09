var componentName = 'overlay-spinner';
var busyModeClass = 'overlay-spinner--busy-mode';

function OverlaySpinnerBlock(component) {
	this.getOverlay = function() {
		return component.$el.find('.overlay-spinner__overlay');
	};
	
	this.getSpinner = function() {
		return component.$el.find('.overlay-spinner__spinner');
	};
}

describe('Overlay spinner functional', function() {
	afterEach(function() {
		helpers.aura.tearDown(this);
	});

	describe('Default structure', function() {
		var template = require('./default.html');

		beforeEach(function() {
			helpers.aura.setUp(this, template, componentName);
			this.pageObject = new OverlaySpinnerBlock(this.component);
		});

		it('Should add/remove spesific class on busy-mode events', function() {
			var $el = this.component.$el;
			var $events = this.component.$events;

			expect($el.hasClass(busyModeClass)).toBe(false);

			$events.trigger('busy-mode-on');

			expect($el.hasClass(busyModeClass)).toBe(true);

			$events.trigger('busy-mode-off');

			expect($el.hasClass(busyModeClass)).toBe(false);
		});
	});
});