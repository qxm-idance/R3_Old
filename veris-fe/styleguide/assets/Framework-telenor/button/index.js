var ATTRIBUTES = {
	loading: 'data-loading',
	loaded: 'data-loaded',
	disabledKey: 'disabled',
	disabledValue: 'disabled'
};

var CLASSES = {
	linkDisabled: 'hidden-event'
};

/**
name: Button
type: ui
desc: Pretty button with processing indication.
options:
    submit: Boolean. If it's `true` than click on button will submit the form.
    setLoading: Boolean. If it's `true` than click on button will set loading state.
events:
    click: Fires by click on button except when `submit` attribute was specified.
	loadedclick: Fires by click on button in `loaded` state.
	actionFinished: Fires when `loading` state was changed to any `loaded` or `default`.
 */
module.exports = {
	events: {
		'click': '_onClick'
	},
	
	/**
	 desc: Gets or sets button's label.
	 */
	text: function() {
		if (arguments.length) {
			this.$el.find('.button__label').text(arguments[0]);
		} else {
			return this.$el.find('.button__label').text();
		}
	},
	/**
	 desc: Switches button to `loading` state. Returns Promise that allows to stop loading.
	 */
	activityIndicator: function() {
		this._loading();

		var dfd = this.$tools.q.defer();

		dfd.then(this._loadedWithSuccess.bind(this), this._loadedWithError.bind(this));

		return dfd;
	},
	/**
	 desc: Enables button.
	 */
	enable: function() {
		this.$el.removeAttr(ATTRIBUTES.disabledKey);
		this.$el.removeClass(CLASSES.linkDisabled);
	},
	/**
	 desc: Disables button.
	 */
	disable: function() {
		this.$el.attr(ATTRIBUTES.disabledKey, ATTRIBUTES.disabledValue);
		
		if (this.$el[0].tagName.toLowerCase() === 'a') {
			this.$el.addClass(CLASSES.linkDisabled);
		}
	},
	/**
	 desc: Sets `loaded` state.
	 */
	setAsLoaded: function() {
		this.$el.removeAttr(ATTRIBUTES.loading);

		this._loadedWithSuccess();
	},
	/**
	 desc: Checks that button was switched to `loaded` state.
	 */
	isLoaded: function() {
		return this.$el.is('[' + ATTRIBUTES.loaded + ']');
	},
	/**
	 desc: Checks that button was switched to `loading` state.
	 */
	isLoading: function(){
		return this.$el.is('[' + ATTRIBUTES.loading + ']');
	},
	/**
	 desc: Set button to loading state.
	 */
	setLoading: function() {
		this._loading();
	},
	/**
	 desc: Resets button to default state.
	 */
	resetLoading: function() {
		this.$el
			.removeAttr(ATTRIBUTES.loading)
			.removeAttr(ATTRIBUTES.loaded);

		this.$events.trigger('actionFinished');
	},

	_onClick: function(e) {

		if (this.isLoading()) {
			e.preventDefault(); // fixed firefox click
			return false;
		}

		if (this.isLoaded()) {
			this.$events.trigger('loadedclick');
			e.preventDefault(); // fixed firefox click
			return false;
		}

		if('setLoading' in this.$options) {
			this.setLoading();
		}

		if ('submit' in this.$options) {
			this.$el.closest('form').submit();
		}

		/* Should be removed after switching to mobile shop. It is used for opening popups with external content (also should be refactored). */
		else if (this.$options.eventname) {
			e.stopPropagation();
			e.preventDefault();
			this.$tools.dom.find(window.document).trigger(this.$options.eventname, [this.$el[0]]);
		}
		/* End Remove */

		else {
			this.$events.trigger('click');
		}
	},
	_loading: function() {
		this.$el
			.removeAttr(ATTRIBUTES.loaded)
			.attr(ATTRIBUTES.loading, true);
	},
	_loadedWithSuccess: function() {
		this.$el
			.removeAttr(ATTRIBUTES.loading)
			.attr(ATTRIBUTES.loaded, true);

		this.$events.trigger('actionFinished');
	},
	_loadedWithError: function() {
		this.$el
			.removeAttr(ATTRIBUTES.loading);

		this.$events.trigger('actionFinished');
	}
};
