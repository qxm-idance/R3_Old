var STATES = {
	opened: 'show',
	closed: 'hide'
};

var CLASSES = {
	collapsed: 'collapsed',
	expanded: 'is-expanded',
	collapsing: 'collapsing'
};

var animationName = 'height';

/**
name: Collapse
type: ui
desc: >
	Collapses/expands content by click on trigger with animation effect.
	Target content should be linked with component collapse by adding it attribute data-element, and use component's scope via alias of component.

	Attribute data-element of target content includes alias of collapse component and value `collapseTarget`. As result - correct alias is: `data-element='menuCollapse:collapseTarget'`.

	Also target content should include div with attribute `data-element='collapseContent'`. Rules for creating value of this attribute are the same as for target holder.

	By default target content is hid. Target content should have class `'collapse--closed'`. First click on trigger expands target content, second - collapses.
	For showing opened state of collapse it's nessesary add attribute data\-active='true' for collapse component and remove class `'collapse--closed'` for target holder.
options:
	active:
		Boolean. Shows target content by default.
	readmore:
		String. Adds a link with specified text as a trigger for collapse component.
	readless:
		String. Should be used together with 'readmore'. Specifies text for trigger in case if content is expanded.
	group:
		String. Name for 'collapse' components that should work together. If one component from group is expanded, other will be collapsed.
*/
module.exports = {
	events: {
		'change': '_toggle',
		'change toggleTrigger': '_toggle',
		'click': '_onClick',
		'click toggleTrigger': '_onClick',
		'transitionend collapseTarget': '_onTransitionEnd'
	},
	initialize: function() {
		this.$options.state = this.$options.active ? STATES.opened : STATES.closed;
		this._setStateClass();
		this._setTriggerText();
		this.$tools.data.pubsub.subscribe('collapse.group.hide', this._hideGroup.bind(this));
	},
	/**
	 desc: Checks state of collapse. Returns `Boolean` value.
	 */
	isExpanded: function() {
		return this.$options.state === STATES.opened;
	},
	/**
		desc: Shows target content if it's hidden and hides if it's shown.
		args:
			show: Forces visibility state. Could be omitted - new state will be opposite to current.
	*/
	toggle: function(show) {
		show = arguments.length ? show : this.$options.state === STATES.closed;
		this[show ? 'show' : 'hide']();
	},
	/**
		desc: Shows target content.
	*/
	show: function() {
		if (this.$options.state === STATES.opened) {
			return;
		}

		this._setHeight();
		this.$elements.collapseTarget.addClass(CLASSES.collapsing);
		this.$options.state = STATES.opened;
		this._setStateClass();
		this._setTriggerText();

		if (this.$options.group) {
			this.$tools.data.pubsub.publish('collapse.group.hide', {
				group: this.$options.group,
				excludeId: this.$options._ref
			});
		}
	},
	/**
		desc: Hides target content.
	*/
	hide: function() {
		if (this.$options.state === STATES.closed) {
			return;
		}
		requestAnimationFrame(function() {
			this._setHeight();
			requestAnimationFrame(function() {
				this.$elements.collapseTarget.css('height', 0);
				this.$elements.collapseTarget.addClass(CLASSES.collapsing);
				this.$options.state = STATES.closed;
				this._setStateClass();
				this._setTriggerText();
			}.bind(this));
		}.bind(this));
	},
	_onClick: function(e) {
		if (!this.$el.is('input:radio, select')) {
			this._toggle();
			e.preventDefault();
		}
	},
	_onChange: function() {
		this._toggle();
	},
	_toggle: function() {
		this.toggle();
	},
	_setTriggerText: function() {
		var textContainer = this.$el;
		if (this.$options.readmore && this.$options.readless) {
			if (this.$elements.toggleText) {
				textContainer = this.$elements.toggleText;
			}
			textContainer.text(this.$options.state === STATES.closed ? this.$options.readmore : this.$options.readless);
		}
	},
	/*
	* Hides link if content is empty.
	* Call this function if content is loaded asynchronously.
	*
	* @return true - if content was hid, otherwise - false.
	*/
	_hideGroup: function(event, data) {
		if (this.$options._ref !== data.excludeId && this.$options.group === data.group) {
			this.hide();
		}
	},
	_setStateClass: function() {
		this.$el
			.toggleClass(CLASSES.collapsed, this.$options.state === STATES.closed)
			.toggleClass(CLASSES.expanded, this.$options.state === STATES.opened);
	},
	_setHeight: function() {
		this.$elements.collapseTarget.css('height', this._getHeight());
	},
	_getHeight: function() {
		return this.$elements.collapseContent.outerHeight(true);
	},
	_onTransitionEnd: function(e) {
		if (e.originalEvent.propertyName !== animationName) {
			return;
		}
		this.$elements.collapseTarget.removeClass(CLASSES.collapsing);
		if (this.$options.state === STATES.opened) {
			this.$elements.collapseTarget.css('height', 'auto');
		}
		this.$events.trigger(this.$options.state);
		this.$events.trigger('changed', this.isExpanded());
	}
};
