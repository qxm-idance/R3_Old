/**
name: Modal Box
type: ui
desc: >
	Shows component content in a Lightbox. Adds overlay around the content.
	Content will be centered horizontally and vertically. Can be closed by close icon or by click on overlay.

	Default classes for markup that could be changed by `data-` attributes.

	```
		overlayClass: 'modal-box__overlay',
		activeClass: 'modal-box--is-open',
		contentClass: 'modal-box__content',
		closeBtnClass: 'modal-box__close-btn',
		closeBtnIconsClass: 'icon icon-reject',
		bodyClass: 'modal-box--is-open'
	```

options:
	modalBoxTrigger: String. Specifies ID in HTML for trigger for current modal-box.
	overlayClose: Boolean. If `false` - click on overlay will not close modal-box. If `true`, but option `modal` is also `true` - it will not have any effect.
	modal: Boolean. If `true` - click on overlay will not close modal-box, close button will not be added. Default - `false`.
    additionalContentClass: String. Additional classes to be added to content element.
events:
	onShow: Fires when modal-box was shown.
	onHide: Fires when modal-box was hidden.
subscriptions:
	show: Opens modal-box.
	hide: Closes modal-box.
 */
module.exports = {
	defaults: {
		overlayClass: 'modal-box__overlay',
		activeClass: 'modal-box--is-open',
		contentClass: 'modal-box__content',
		additionalContentClass: '',
		closeBtnClass: 'modal-box__close-btn',
		closeBtnIconsClass: 'icon icon-reject',
		bodyClass: 'modal-box--is-open',

		modal: false,
		overlayClose: true
	},

	events: {
		'click [data-selector=buttonClose]': 'hide',
		'click $close': 'hide'
	},

	initialize: function() {
		this.$options = this.$tools.util.extend(true, Object.create(this.defaults), this.$options);

		this.$events.on('show', this.show.bind(this));
		this.$events.on('hide', this.hide.bind(this));
		this.$events.on('addClass', this._addClass.bind(this));
	},

	ready: function() {
		var overlay = '<div class="' + this.$options.overlayClass  + '"></div>';
		var closeButton = '<div class="' + this.$options.closeBtnClass + ' ' + this.$options.closeBtnIconsClass + '"></div>';

		this._$popup = this.$tools.dom.find('<div>');
		this._$popup.append(this.$el[0].childNodes);
		this._$popup[0].className = this.$el[0].className;

		this.$overlay = this.$tools.dom.find('body').append(overlay).children(':last');
		this.$trigger = this.$tools.dom.find('#' + this.$options.modalBoxTrigger);
		this._$popup.addClass(this.$options.contentClass);

		this.$overlay.append(this._$popup);

		this.$trigger.on('click', this.show.bind(this));

		if (!this.$options.modal) {
			this.$closeButton = this._$popup.prepend(closeButton).children(':first');
			this.$closeButton.on('click', this._onCloseClick.bind(this));
		}

		if (this.$options.overlayClose && !this.$options.modal) {
			this.$overlay.on('click', this._onCloseClick.bind(this));
		}
	},

	/**
	 desc: Opens modal-box.
	 */
	show: function() {
		this.$tools.dom.find('body').addClass(this.$options.bodyClass);
		this.$overlay.addClass(this.$options.activeClass);
		this.$events.trigger('onShow');
	},

	/**
	 desc: Closes modal-box.
	 */
	hide: function() {
		this.$tools.dom.find('body').removeClass(this.$options.bodyClass);
		this.$overlay.removeClass(this.$options.activeClass);
		this.$events.trigger('onHide');
	},

	/**
	 desc: Cleans modal box HTML.
	 */
	destroy: function() {
		this.$overlay.remove();
	},

	/**
		desc: looks for elements in modal box popup by given CSS selector
		args:
			selector: CSS selector to look for
	*/
	find: function(selector) {
		return this._$popup.find(selector);
	},

	_onCloseClick: function(e) {
		var $target = this.$tools.dom.find(e.target);

		if ($target.closest('.' + this.$options.contentClass.trim().replace(/\s+/g, '.')).length && !$target.closest('.' + this.$options.closeBtnClass.trim().replace(/\s+/g, '.')).length) {
			return;
		}

		this.hide();
	},

	_addClass: function(e, classString) {
		if (this.$options.additionalContentClass) {
			this._$popup.removeClass(this.$options.additionalContentClass);
		}

		this.$options.additionalContentClass = classString;

		if (this.$options.additionalContentClass) {
			this._$popup.addClass(this.$options.additionalContentClass);
		}
	}
};
