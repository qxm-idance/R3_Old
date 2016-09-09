var STATES = {
	opened: 'open',
	closed: 'close'
};
var CLASSES = {
	prefix: 'message--',
	closed: 'closed',
	alert: 'alert',
	error: 'error',
	warning: 'warning',
	collapsing: 'collapsing'
};

var animationName = 'height';

/**
name: Message
type: ui
desc: Can show notification to user.
options:
	autoclose: Number. Sets time for auto close the message in milliseconds.
events:
	click: Fires by click on close button if it exists.
	transitionend: Fires after finishing of show/hide animations.
 */
module.exports = {
	events: {
		'click $messageClose': '_onClick',
		'transitionend': '_onTransitionEnd'
	},
	ready: function() {
		if ('autoclose' in this.$options) {
			this._startAutoCloseTimer(this.$options.autoclose);
		}
		this.$options.state = this.$el.hasClass(CLASSES.prefix + CLASSES.closed) ? STATES.closed : STATES.opened;
	},
	/**
	desc:
		Sets text for the message
	args:
		newText: String
	*/
	setText: function(newText) {
		this.$elements.messageText.text(newText);
	},
	/**
	desc:
		Sets type of message, possible values - 'error', 'warning', 'alert'.
	args:
		newType: String
	*/
	setType: function(newType) {
		var typeClasses = this._getTypeClasses();
		this.$el.removeClass(typeClasses).addClass(CLASSES.prefix + newType);
	},
	/**
	desc:
		Sets 'error' type of message and sets text for the message.
	args:
		text: String
	*/
	error: function(text) {
		this._message(text, CLASSES.error);

		return this;
	},
	/**
	desc:
		Sets 'warning' type of message and sets text for the message.
	args:
		text: String
	*/
	warning: function(text) {
		this._message(text, CLASSES.warning);

		return this;
	},
	/**
	desc:
		Sets 'alert' type of message and sets text for the message.
	args:
		text: String
	*/
	alert: function(text) {
		this._message(text, CLASSES.alert);

		return this;
	},
	/**
	desc:
		Shows the message.
	*/
	open: function() {
		if (this.$options.state === STATES.opened) {
			return;
		}
		this._setHeight();
		this.$el.addClass(CLASSES.collapsing);
		this.$options.state = STATES.opened;
	},
	/**
	desc:
		Closes the message.
	*/
	close: function() {
		if (this.$options.state === STATES.closed) {
			return;
		}
		requestAnimationFrame(function() {
			this._setHeight();
			requestAnimationFrame(function() {
				this.$el.css('height', 0);
				this.$el.addClass(CLASSES.collapsing);
				this.$options.state = STATES.closed;
				if (this.$options.closeAction) {
					this.$tools.data.get(this.$options.closeAction);
				}
			}.bind(this));
		}.bind(this));
	},
	_onClick: function(e) {
		this.close();
		e.preventDefault();
	},
	_onTransitionEnd: function(e) {
		if (e.originalEvent.propertyName !== animationName) {
			return;
		}
		this.$el.removeClass(CLASSES.collapsing);
		if (this.$options.state === STATES.opened) {
			this.$el.css('height', 'auto');
		}
		this.$events.trigger(this.$options.state);
	},
	_startAutoCloseTimer: function(time) {
		var closeTime = time || 0;
		setTimeout(this.close, closeTime);
	},
	_message: function(msg, type) {
		this.setText(msg);
		this.setType(type);
	},
	_setHeight: function() {
		this.$el.css('height', this._getHeight());
	},
	_getHeight: function() {
		return this.$elements.messageContent.outerHeight(true);
	},
	_getTypeClasses: function() {
		return [CLASSES.prefix + CLASSES.alert, CLASSES.prefix + CLASSES.error, CLASSES.prefix + CLASSES.warning].join(' ');
	}
};
