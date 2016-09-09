/**
	name: Datatables selectable
	type: ui
	desc: >
		Selectable extension
	events:
		selectionChanged: fires when row selectin has beed changed
*/
module.exports = {
	events: {
		'checked $selectAll': 'selectAllRows',
		'unchecked $selectAll': 'deselectAllRows'
	},

	initialize: function() {
		this.$events.on('drawed', this._initSelectRow.bind(this));
		this.$events.on('ajax', this._onAjax.bind(this));
	},

	/**
		desc: Set all checkboxes as checked
	*/
	selectAllRows: function() {
		this._findSelectCheckboxes().prop('checked', true);
		this._triggerChange();
	},

	/**
		desc: Set all checkboxes as unchecked
	*/
	deselectAllRows: function() {
		this._findSelectCheckboxes().prop('checked', false);
		this._triggerChange();
	},

	/**
		desc: Returns array of checked checkboxe values
	*/
	getSelection: function() {
		var result = [];

		this._findSelectCheckboxes().filter(':checked').each(function() {
			result.push(this.value);
		});

		return result;
	},

	_triggerChange: function(selection) {
		this.$events.trigger('selectionChanged', selection || this.getSelection());
	},

	_onAjax: function() {
		this.$components.selectAll.uncheck();

		this._triggerChange([]);
	},

	_findSelectCheckboxes: function() {
		return this.$elements.rowCheckbox;
	},

	_initSelectRow: function() {
		var checkboxes = this._findSelectCheckboxes();

		checkboxes.on('change', function() {
			this.$components.selectAll.$el.prop('checked', checkboxes.filter(':checked').length === checkboxes.length);

			this._triggerChange();
		}.bind(this));
	}
};
