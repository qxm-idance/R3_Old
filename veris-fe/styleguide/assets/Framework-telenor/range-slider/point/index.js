/**
	name: Range slider
	type: ui
	desc: Creates pointer for slider
	events:
		move: trigger when need to move pointer
		args:
		pageX: pageX where need to move pointer
 */

module.exports = {
	events: {
		'mousedown': '_mouseDown',
		'touchstart': '_mouseDown'
	},

	_mouseDown: function() {
		var mouseMoveHandler = this._mouseMove.bind(this);

		this.$tools.dom.find('body').on('mousemove touchmove', mouseMoveHandler)
			.on('mouseup touchend mouseleave', function() {
				this.$tools.dom.find('body').off('mousemove touchmove', mouseMoveHandler);
			}.bind(this));
	},

	_mouseMove: function(e) {
		this.$events.trigger('move', e.pageX);
	},

	/**
		desc: set tooltip text for pointer
		args:
			text: new tooltip text
	 */
	setTooltipText: function(text) {
		if (!this.$components.tooltip) {
			return;
		}

		this.$components.tooltip[0].text(text);
	},

	/**
		desc: Show pointer tooltip
	 */
	showTooltip: function() {
		if (!this.$components.tooltip) {
			return;
		}

		this.$components.tooltip[0].show();
	},

	/**
		desc: Hide pointer tooltip
	 */
	hideTooltip: function() {
		if (!this.$components.tooltip) {
			return;
		}

		this.$components.tooltip[0].hide();
	}
};
