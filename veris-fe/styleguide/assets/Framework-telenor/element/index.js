var external = require('./public.js');

function AuraElement(){}

/* Get fake Element prototype to prevent it of passing "instance of Array" validation */
AuraElement.prototype = external.forgery();

AuraElement.prototype.constructor = AuraElement;

/* Using Framework::element as Component is DEPRECATED. Use it only as stumer for elements collection and event */

/**
name: Element
type: ui
desc: Lorem ipsum dolor sit amet.
 */
module.exports = {
	initialize: function(){
		external.call(this, this.$el.get ? this.$el.get() : this.$el);

		/* Base Component`s prototype */
		this.__super = this.constructor.prototype;
		this.mixEvents('');
	},

	ready: function() {
		this.overlap();
	},

	/* Overlaping methods with the same name for Element(external) calling Component methods */
	overlap: function() {
		this.show = function() {
			return this.__super.show.apply(this, arguments);
		};

		this.hide = function() {
			return this.__super.hide.apply(this, arguments);
		};

		this.toggle = function() {
			return this.__super.toggle.apply(this, arguments);
		};

		this.html = function() {
			return this.__super.html.apply(this, arguments);
		};
	},

	constructor: AuraElement
};
