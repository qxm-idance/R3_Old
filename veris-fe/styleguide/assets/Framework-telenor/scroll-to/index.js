var	pubsub = require('pubsub-js'),
	jqScrollTo = require('jquery.scrollTo');

module.exports = {
	events: {
		"click": "_scrollTo"
	},

	_scrollTo: function(e){
		e.preventDefault();

		var isMobile = this.$tools.browser.isMobile;
		var only = this.$options.only;
		var shouldScroll = !only || (isMobile && only === 'mobile') || (!isMobile && only === 'desktop');

		shouldScroll && this.scrollTo(this.$tools.dom.find(this.$options.target), this.$options.speed || 200);
	},

	scrollTo: function($target, speed, offset){
		pubsub.publish('header.height', function(headerHeight){
			offset = (-offset || 0) - headerHeight;
			jqScrollTo($target, speed, { offset: offset });
		}.bind(this));
	}
};