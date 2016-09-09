/**
name: Tooltip
type: ui
desc: >
	Shows information in a tooltip.
	Can contains blocks with classes '.tooltip\_\_content' and '.tooltip\_\_spinner' for showing loading. Attribute 'data-loading="true"' shows '.tooltip\_\_spinner' and hides '.tooltip\_\_content' block.
	Methods 'setLoading' and 'resetLoading' add/remove attribute 'data-loading="true"' in component to show loading process.
 */
module.exports = {
	initialize: function() {
		this.$trigger = this.$el.parent().addClass('tooltip__trigger');
		this.$trigger.on('mouseenter touchstart', this.show.bind(this));
	},
	events : {},
	/**
	 desc: Shows tooltip.
	 */
	show: function() {
		var elClone = this.$tools.dom.find(this.$el[0].cloneNode(true));
		var body = this.$tools.dom.find('body');
		var _completed = function() {
			elClone.remove();

			this.$trigger.off('mouseleave', _completed);
			body.off('touchstart', _completed);

			this.$events.trigger('hide');
		}.bind(this);


		this.$events.trigger('beforeShow');


		body.append(elClone);
		this._setPosition(elClone);

		this.$trigger.on('mouseleave', _completed);
		body.on('touchstart', _completed);


		this.$events.trigger('show');
	},
	/**
	 desc: Sets text value for tooltip content.
	 */
	text: function() {
		if (arguments.length) {
			this.$el.find('p').text(arguments[0]);
		} else {
			return this.$el.find('p').text();
		}
	},
	hide: function() {
		this.$tools.logger.error('Method "hide" is removed.');
	},
	/**
	 desc: Adds attribute data-loading="true" for showing content loading.
	 */
	setLoading: function() {
		this.$el.attr('data-loading', true);
	},
	/**
	 desc: Removes attribute data-loading="true" for hiding content loading.
	 */
	resetLoading: function() {
		this.$el.removeAttr('data-loading');
	},
	_setPosition: function(el) {
		var posLeft;
		var posTop;

		this._setDefaultPosition(el);

		if(this.$tools.dom.find(window).width() < el.outerWidth() * 1.5) {
			el.css('max-width', this.$tools.dom.find(window).width() / 2);
		} else {
			el.css('max-width', 320);
		}

		posLeft = this.$trigger.offset().left + (this.$trigger.outerWidth() / 2) - (el.outerWidth() / 2);
		posTop = this.$trigger.offset().top - el.outerHeight() - 10;

		if (posLeft < 0) {
			posLeft = this.$trigger.offset().left + this.$trigger.outerWidth() / 2 - 10;
			el.addClass('tooltip--left');
			posLeft -= 12;
		}

		if (posLeft + el.outerWidth() > this.$tools.dom.find(window).width()) {
			posLeft = this.$trigger.offset().left - el.outerWidth() + this.$trigger.outerWidth() / 2 + 10;
			el.addClass('tooltip--right');
			posLeft -= 3;
		}

		if (posTop < 0) {
			posTop  = this.$trigger.offset().top + this.$trigger.outerHeight();
			el.addClass('tooltip--top');
		}

		el.css({left: posLeft, top: posTop});
	},
	_setDefaultPosition: function(el) {
		el.removeAttr('style');
		el.removeClass('tooltip--left');
		el.removeClass('tooltip--right');
		el.removeClass('tooltip--top');
	}
};
