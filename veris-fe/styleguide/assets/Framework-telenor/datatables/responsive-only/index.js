var $ = require('jquery');
var DataTables = require('datatables.net');
var responsive = require('datatables.net-responsive');

/**
	name: Datatables responsive only
	type: ui
	desc: >
		Table which need only responsive functionality
*/

module.exports = {
	events: {
		'draw.dt': '_draw'
	},

	ready: function() {
		this._$().DataTable({
			dom: 't',
			paging: false,
			searching: false,
			ordering:  false,
			autoWidth: false,
			responsive: {
				details: {
					type: 'inline'
				}
			}
		});
	},

	_draw: function(e) {
		e.stopImmediatePropagation();
		e.preventDefault();

		return false;
	},

	_$: function(){
		return $(this.$el[0]);
	}
};
