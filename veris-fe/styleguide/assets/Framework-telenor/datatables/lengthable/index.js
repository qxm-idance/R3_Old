/**
	name: Datatables lengthable
	type: ui
	desc: >
		Extension of rows count changing
*/

module.exports = {
	events: {
		'change $lengthMenu': '_onChange'
	},

	initialize: function() {
		this.$el.find('table:first').one('draw.dt', this._showSelect.bind(this));
		this.wrapper = this.$el.find('[data-alias="lengthMenuWrap"]');
		this.$events.on('optionsReady', this._optionsReady.bind(this));
		this.$events.on('apiReady', this._apiReady.bind(this));
	},

	_value: function() {
		return parseInt(this.$components.lengthMenu.getValue(), 10);
	},

	_optionsReady: function($ev, options) {
		if (!this.$components.lengthMenu) {
			return;
		}

		this.options = options;

		this.options.pageLength = this._value();
	},

	_onChange: function() {
		if (!this.$components.lengthMenu) {
			return;
		}

		var len = this._value();

		this.api.dataTablesAPI.page.len(len).draw();
		this.options.pageLength = len;
	},

	_apiReady: function($ev, api) {
		this.api = api;
	},

	_showSelect: function() {
		this.$components.lengthMenu && this.$components.lengthMenu.show();
		this.wrapper.removeClass('js-hidden');
	}
};
