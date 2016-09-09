/**
name: extension for Modal Box
type: ui
desc: >
	Allows modal box to load html from from URL specified in "href" attribute of the link
options:
	modalBoxTrigger: String. Specifies value of the "data-selector" attribute for searching elements.
 */

var loadingClass = 'modal-box--is-loading';

module.exports = {
	initialize: function() {
		this._preloaderTmpl = this.$tools.template.parse(require('./templates/spinner.html'));
		this.$tools.dom.find(window.document).on('load.ajax.modal', this._onModalLinkClick.bind(this));
	},

	ready: function() {
		this.$trigger = this.$tools.dom.find('[data-selector="' + this.$options.modalBoxTrigger + '"]');
		this.$trigger.on('click', this._onModalLinkClick.bind(this));
	},

	_setContent: function(html) {
		(this.$components.modalBoxContent || this).html(html);
	},

	_showPreloader: function(header, body) {
		this._setContent(this._preloaderTmpl());
		this.$el.addClass(loadingClass);
		this.$events.trigger('show');
	},

	_onModalLinkClick: function(e, target) {
		e.preventDefault();

		var url = (target || e.currentTarget).href;
		var additionalClass = (target || e.currentTarget).getAttribute('data-additional-content-class') || '';

		this._showPreloader();
		this.$events.trigger('addClass', additionalClass);

		this.$tools.data.get(url)
			.then(this._contentLoaded.bind(this, additionalClass))
			.catch(this._loadFailed.bind(this));
	},

	_contentLoaded: function(additionalClass, response) {
		this._setContent(response);
		this.$el.removeClass(loadingClass);
		this.$events.trigger('addClass', additionalClass);
	},

	_loadFailed: function(params) {
		this.$events.trigger('hide');
	}
};
