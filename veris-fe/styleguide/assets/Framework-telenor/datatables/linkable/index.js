/**
	name: Datatables linkable
	type: ui
	desc: >
		**Should be deleted. We have column types to handle this situation.**
*/
module.exports = {
	events: {
		'click tr' : '_onRowClick',
		'loaded $this': '_onLoaded'
	},

	initialize: function() {
		this.$events.on('optionsReady', this._optionsReady.bind(this));
	},

	/*
	rebind events on loaded event from datatables component.
	*/
	_onLoaded: function() {
		this.unbindEvents();
		this.bindEvents();
	},

	_optionsReady: function($ev, options) {
		options.createdRow = function(row, data, index) {
			var action = data[this.$options.rowSelectionAction];

			if (action) {
				row.setAttribute('data-selection-action', action);
			}
		}.bind(this);
	},

	_onRowClick: function(e) {
		if (this.$tools.dom.find(e.target).closest('.table__expander').length !== 0) {
			return;
		}

		var currentTarget = e.currentTarget;
		var action = currentTarget.getAttribute('data-selection-action') || '';
		var defaultPrevented = false;
		var target = e.target;
		var targetName = target.tagName.toLowerCase();

		this.$events.trigger('rowSelected', {
			action: action,
			event: e,
			preventDefault: function() {
				defaultPrevented = true;
			}
		});

		while(target && !defaultPrevented &&
				(target !== currentTarget)) {
			defaultPrevented = defaultPrevented || !!target.getAttribute('data-prevented-row-selection');
			target = target.parentNode;
		}

		if(action && !defaultPrevented &&
				!(/^(input|select|label|a)$/.test(targetName))) {

			this.$tools.util.redirect(action);
		}
	}
};
