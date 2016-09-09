/**
	desc: Render functions for our datatables columns
	*/

module.exports = {
	checkbox: function(params, data, type, row) {
		return '<input type="checkbox" id="check-' + row[params.idName] + '" name="' + params.name + '" value="' + row[params.valueName] + '"/>\
		<label for="check-' + row[params.idName] + '"></label>';
	},

	expand: function(params, data) {
		return ('<div class="th_bill_trigger table__expander float-left">\
				<a class="icon-expand" href="' + data + '"></a>\
			</div>');
	},

	emptyCell: function() {
		return '&nbsp;';
	}
};
