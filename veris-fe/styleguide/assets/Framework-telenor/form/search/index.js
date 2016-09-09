/**
name: Form search
type: ui
desc: >
	Fancy input with clear and submit buttons
options:
    searchOnChange: Boolean. trigger `search` event when value was changed
events:
	search: fires when user enters search term
	clear: fires when user clicks clear button
*/
module.exports = {
	ready: function() {
		this.$input = this.$el.find('input');
		this.$clear = this.$el.find('button[data-list-clear]');

		if (navigator.userAgent.indexOf('iPad') !== -1 || navigator.userAgent.indexOf('iPhone') !== -1) {
			this.$input.attr('type', 'text');
		}

		this._updateState();
		this.$input.val('');

		if (this.$tools.dom.find('html').hasClass('ie8')) {
			this.$input.on('keydown', this.onInput.bind(this));
		}

		if (this.$input.val().length) {
			this.onInput();
		}

        if (this.$options.searchOnChange) {
            this.$input.on('typeWatch', this.onSubmit.bind(this));
        }

		this.checkClear();
	},

	initialize: function() {
		this.debouncedInputHandler = this.$tools.helper.debounce(function() {
			this._updateState();
			this.onSubmit();
		}.bind(this), 200);
	},

	events: {
		'input input': 'onInput',
		'keypress input': 'onKeypress',
		'click .form-search__submit': 'onSubmit',
		'click button[data-list-clear]': 'onClear'
	},
	_updateState: function() {
		this.$el.toggleClass('is-empty', !this.$input.val().length);
	},
	_clear: function() {
		this.$input.val('').trigger('input');
		this.$input.trigger('change');
		this.$input.trigger('clear');
		this.onSubmit();

		this._updateState();

		this.checkClear();
	},
	checkClear: function() {
		if (this.$input.val().length === 0) {
			this.$clear.hide();

			return;
		}

		this.$clear.show();
	},
	onInput: function() {
		if(this.$options.searchOnChange) {
			this.debouncedInputHandler();
		}
		this.checkClear();

	},
	onClear: function() {
		this._clear();
	},
	onSubmit: function() {
		this.$events.trigger('search', this.$input.val());

		return false;
	},
	onKeypress: function(e) {
		return e.which !== 13;
	},


	toggleDisable: function(disable) {
		this.$el.find('input, textarea, button, select').prop('disabled', disable);

		return this;

	}
};
