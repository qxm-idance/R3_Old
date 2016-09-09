var $ = require('jquery');
/**
	name: Datatables expandable
	type: ui
	desc: >
		Expandable extension to load additional info about row
*/
var CLASSES = {
	dropRow: 'drop-row',
	dropItem: 'drop-item',
	child: 'child',
	expanded: 'expanded'
};

module.exports = {
	initialize: function() {
		this.ajaxIndex = 0;
		this.ajaxes = {};

		this._expandHandler = this._onClick.bind(this);

		this.$events.on('drawed', this._onDraw.bind(this));
		this.$events.on('ajax', this._onAjax.bind(this));
		this.$events.on('optionsReady', this._optionsReady.bind(this));
	},

	ready: function() {
		if (this.$options.loaded) {
			this._onDraw();
		}
	},

	_optionsReady: function($ev, options) {
		this.options = options;
	},

	_onAjax: function() {
		this.$tools.util.each(this.ajaxes, function() {
			this.abort();
		});

		this.ajaxes = {};
	},

	_onDraw: function() {
		this.$el.find('table:first .icon-expand:not(.expand-disabled)')
			.off('click', this._expandHandler)
			.click(this._expandHandler);
	},

	_getLoadingRow: function() {
		var template = this.options.loadingRow;
		var $loading = this.$tools.dom.find(template);
		var i = 0;
		var loadingId = 'data-table-loading-row';

		while (this.$tools.dom.find('#' + loadingId + '-' + i).length !== 0) {
			++i;
		}

		$loading.prop('id', loadingId + '-' + i);
		this.options.markRowAsLoaded($loading.get(0));

		return $loading;
	},

	_onClick: function(e) {
		var curLink = this.$tools.dom.find(e.target);
		var curRow = curLink.closest('tr');
		var next = curRow.next();
		var $loading;
		var rowId;
		var ajaxKey;
		var cached;
		var inst;
		var data;

		e.preventDefault();

		if (next.hasClass(CLASSES.child)) {
			next = next.next();
		}

		if (next.hasClass(CLASSES.dropRow)) {
			if (next.is(':visible')) {
				next.hide();
				curRow.removeClass(CLASSES.expanded);

				return;
			}

			next.show();
			curRow.addClass(CLASSES.expanded);

			return;
		}

		$loading = this._getLoadingRow();
		var containerElem = document.createElement('div');
		containerElem.innerHTML = '<tr class="js-hidden"></tr>';
		$loading = $loading.add(containerElem.firstChild);

		curRow.after($loading);

		rowId =  curLink.prop('id');

		curRow.addClass(CLASSES.expanded);

		inst = this._$().find('table:first').DataTable();
		data = inst.row(curRow).data();

		if (this.$options.cachedExpand && data[this.$options.cachedExpand]) {
			this._ajaxSuccess($loading, {
				data: [{
					html: data[this.$options.cachedExpand]
				}]
			});

			return;
		}

		ajaxKey = 'ajax' + this.ajaxIndex++;

		this.ajaxes[ajaxKey] = this.$tools.data.get(curLink.prop('href'))
			.then(this._ajaxSuccess.bind(this, $loading))
			.catch(this._ajaxFailed.bind(this, $loading, curRow))
			.finally(this._ajaxComplete.bind(this, ajaxKey));
	},

	_ajaxSuccess: function($loading, data) {
		var template = data.data[0].html;

		this.html(template, '#' + $loading.prop('id') + ' .table__loading');

		$loading.prop('id', '');
		$loading.addClass(CLASSES.dropRow);
		$loading.find('> td').removeClass('load-tester table__loading').addClass(CLASSES.dropItem);
	},

	_ajaxFailed: function($loading, curRow) {
		$loading.remove();
		curRow.removeClass(CLASSES.expanded);
	},

	_ajaxComplete: function(ajaxKey) {
		delete this.ajaxes[ajaxKey];
	},

	/*
	This is an isolation for jquery usage. Must be removed once datatables
	re-implemented and don't need jQuery anymore
	*/
	_$: function(){
		return $(this.$el[0]);
	}
};
