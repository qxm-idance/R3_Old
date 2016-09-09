/**
name: Dropdown
type: ui
desc: >
	Renders popup with items list. Has ability to navigate through list via keyboard arrows.
	`Esc` key and outside mouse click closes dropdown.
events:
	open: Fires when dropdown was shown.
	close: Fires when dropdown was hidden.
 */
module.exports = {
	events: {
		'newItemsAdded $this': '_bindEventsOnItems'
	},

	initialize: function() {
		this.isCollapsed = true;

		this.$toggle = this.$el.find('.dropdown__label, .dropdown__toggle, [data-toggle="dropdown"]');

		this.$toggle.on('click.dropdown', this._onClick.bind(this));

		this.$tools.dom.find(document).on('keydown.dropdown', this._onKeydown.bind(this));

		this._onChooseOptionHandler = this._onChooseOption.bind(this);

		this._bindEventsOnItems();
	},

	/**
	desc: Toggles dropdown state.
	 */
	toggle: function() {
		if (this.isCollapsed) {
			this.open();
		} else {
			this.close();
		}
	},

	/**
	 desc: Shows dropdown popup.
	 */
	open: function() {
		if (this.$options.disabled) {
			return;
		}

		this.isCollapsed = false;
		this.$el.addClass('is-open');

		this.$tools.dom.find(document).on('click.dropdown', this._onDocumentClick.bind(this));

		this.$events.trigger('open');
	},

	/**
	 desc: Hides dropdown popup.
	 */
	close: function() {
		this.isCollapsed = true;
		this.$el.removeClass('is-open');

		this.$tools.dom.find(document).off('click.dropdown');

		this.$events.trigger('close');
	},

	/**
		desc: Disables open dropdown component
		*/
	disable: function() {
		this.$options.disabled = true;
		this.$toggle.attr('disabled', 'disabled');
		this.close();
	},

	/**
		desc: Enables open dropdown component
		*/
	enable: function() {
		this.$options.disabled = false;
		this.$toggle.removeAttr('disabled');
	},

	/**
		desc: Set title for element to show some hint for user
		*/
	setTitle: function(text) {
		this.$el.prop('title', text);
	},

	_bindEventsOnItems: function() {
		this.$el.find('.dropdown__content li')
			.off('click.dropdown', this._onChooseOptionHandler)
			.on('click.dropdown', this._onChooseOptionHandler);

	},

	_onClick: function() {
		this.toggle();

		return false;
	},

	_onChooseOption: function(e) {
		if (this.$options.disableChooseOption) {
			return;
		}

		if (e.currentTarget.dataset.value) {
			this.$events.trigger('change', e.currentTarget.dataset.value);
		}

		this.toggle();
	},

	_onKeydown: function(e) {
		if (!/(27|38|40)/.test(e.which) || this.isCollapsed) {
			return;
		}

		// Escape.
		if (e.which === 27) {
			this.close();
			return;
		}

		var $activeEl = this.$tools.dom.find(document.activeElement),
			$items = this.$el.find('.dropdown__list > li'),
			$focusedItem = $activeEl.parent(),
			index = $items.index($focusedItem);

		// Up.
		if (e.which === 38 && index > 0) {
			index--;
		}

		// Down.
		if (e.which === 40 && index < $items.length - 1) {
			index++;
		}

		if (!index) {
			index = 0;
		}

		$items.eq(index).find('> a').focus();

		return false;
	},

	_onDocumentClick: function(e) {
		if (!this.$el[0].contains(e.target)) {
			this.close();
		}
	}
};
