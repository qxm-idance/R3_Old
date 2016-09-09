var $ = require('jquery');
var DataTables = require('datatables.net');
var responsive = require('datatables.net-responsive');
var ApiWrapper = require('./api_wrapper');
var scrollTo = require('jquery.scrollTo');
var defaultRenderers = require('./renders');
var cellId = 0;
var menuHeight = 60;

/*
	dirty hack to use OneScreen classes for paginator
*/
DataTables.ext.classes.sPaging = "pager ";
DataTables.ext.classes.sPageButton = "pager__button";

require('./dataTables.pagination');

/**
name: Datatables
type: ui
desc: >
	Advanced interaction controls to HTML tables.

	##Column data- options

	*name* - column name

	*title* - column title

	*data* - column field name

	##Examples

	Request example:

		{
			"pageSize": 10,
			"pageNumber": 1, //starts from 1
			"sort": [ //optional parameters
				{
					"name": "column name",
					"direction": "ASC" //possible values are ASC or DESC
				}
			],
			"filters": [ //optional parameters
				{
					"type": "filter type", //possible values: containce, greater, lower
					"name": "column name",
					"value": "filter value" //could be {}, [] or ""
				}
			]
		}

	Response example:

		{
			"success": "true",
			"errorMessages": [], // could be null
			"data": {
				"data": [
					{
						"customerId": "1",
						"customerName": "A",
						"customerStatus": "Active",
						"customerLegalAddress": "Mansfield Reformatory",
						"customerRegistered": "tomorrow"
					},
					{
						"customerId": "2",
						"customerName": "B",
						"customerStatus": "Suspended",
						"customerLegalAddress": "Mansfield Reformatory",
						"customerRegistered": "today"
					}
				],
				"totalCount": 2,
				"pageSize": 2,
				"pageNumber": 1,
			}
		}
options:
	orderStart: initial ordering value
	configKey: name of TN config section. `TN.config.table.data[this.$options.configKey];`
	url: server endpoint address
	method: HTTP method,
	pageSize: items per page,
	noRecordsText: no records label
*/
module.exports = {
	initialize: function() {
		this.tableCompiled = this.$tools.template.parse(require('./html/table.html'));

		this.$options.scrollOffset = this.$options.scrollOffset || 0;
		this.options = {
			dom: 't<"stretch-mobile pager--wrap padding-whole mobile-padding-leader--small mobile-padding-trailer--small mobile-text--right"p>',
			info: false,
			serverSide: true,
			ajax: this._ajax.bind(this),
			pageLength: this._getDefaultAjaxOptions().pageSize,
			responsive: {
				details: {
					type: 'column',
					target: '.table__expand-cell'
				}
			},
			language: {
				paginate: {
					loadmore: 'Load more'
				}
			},
			pagingType: 'simple_numbers',
			markRowAsLoaded: this._markRowAsLoaded.bind(this)
		};

		if (typeof this.$options.autoWidth !== 'undefined') {
			this.options.autoWidth = this.$options.autoWidth;
		}

		this.lastAjax = null;

		this.hasLoadedOnce = false;

		this._$().on('draw.dt', this._onDraw.bind(this));
		this._$().find('table:first').one('draw.dt', this._toggleFirst.bind(this));
		this.$events.on('reload', this._reload.bind(this));
	},

	ready: function() {
		this.$events.trigger('optionsReady', this.options);

		return this._table()
			.then(function(api) {
				this.$components.filter && this.$components.filter.setApi(api);
				this.$events.trigger('apiReady', api);
			}.bind(this));
	},

	_getDefaultAjaxOptions: function() {
		return {
			pageSize: 10,
			pageNumber: 1,
			sort: [],
			filters: []
		};
	},

	_ajax: function(data, callback, settings) {
		if (this.$components.filter && !this.$components.filter.isValid()) {
			return;
		}

		var filters = this.$components.filter ? this.$components.filter.values() : [];
		var sort = !data.order ? [] : data.order.map(function(order) {
			return {
				name: settings.aoColumns[order.column].data,
				direction: order.dir
			};
		});
		var method = (this.$options.method || 'post').toLowerCase();
		var lastFilter = this.$components.filter && this.$components.filter.getLast();
		var ajaxOptions = this.$tools.util.extend(true, this._getDefaultAjaxOptions(), {
			sort: sort,
			filters: filters,
			pageNumber: (data.start === 0 ? 0 : data.start / data.length) + 1,
			pageSize: data.length,
			lastFilter: lastFilter
		});
		var req = method === 'post' ? JSON.stringify(ajaxOptions) : ajaxOptions;
		var doc;
		var top;
		var offsetTop;

		this.lastAjax && this.lastAjax.abort();

		if (!settings.bLoadMore && this.options.url) {
			this.$el.find('table:first tbody tr').remove();
			this.$el.find('table:first tbody').append(this.options.loadingRow);
			this.$el.find('table:first').css('border-collapse', 'separate');
		}

		doc = document.documentElement;
		top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
		offsetTop = this.$el.offset().top;

		if (this.hasLoadedOnce && !settings.bLoadMore && !this.$options.withoutScroll && top > offsetTop) {
			scrollTo(offsetTop + this.$options.scrollOffset - menuHeight);
		}

		this.hasLoadedOnce = true;

		this.lastAjax = this.$tools.data[method](this.options.url, req);

		this.lastAjax
			.then(function(response) {
				var totalCount;

				this.lastAjax = null;

				if (!response.success) {
					this._loadingFailed(data.draw, settings, callback);

					return;
				}

				totalCount = response.data.totalCount;

				if (response.data.hasMore) {
					totalCount = this.$el.find('table:first > tbody > tr').length +
						data.length +
						response.data.data.length +
						this.options.pageLength;
				}

				if (response.data.data.length) {
					this.$el.find('table:first').css('border-collapse', 'collapse');
				}

				response.data.data.forEach(function(rowData) {
					rowData.expandColumn = 'javascript:void(0)';
				});

				callback({
					draw: data.draw,
					data: response.data.data,
					recordsTotal: totalCount,
					recordsFiltered: totalCount
				});

				this.$events.trigger('loaded', response.data);
			}.bind(this))

			.catch(this._loadingFailed.bind(this, data.draw, settings, callback));

		this.$events.trigger('ajax');
	},

	_loadingFailed: function(draw, settings, callback) {
		var total = settings.bLoadMore ? this.$el.find('table:first > tbody > tr').length : 0;

		callback({
			draw: draw,
			data: [],
			recordsTotal: total,
			recordsFiltered: total
		});

		this.lastAjax = null;
	},

	_table: function() {
		var dfd = this.$tools.q.defer();
		this.options = this.$tools.util.extend(true, this.options, this._options());

		this.options.responsive.breakpoints = this._getResponsiveBreakpoints(this.options);

		this.options.loadingRow = '<tr><td class="table__loading text--center" colspan="' + this.options.columns.length + '"><span class="spinner--large"></span></td></tr>';

		if (this.$el.find('table:first').length) {
			dfd.resolve(this._api());

			return dfd.promise();
		}

		this.$el.append('<div class="datatables-table-wrapper">');

		this.html(this.tableCompiled({columns: this.options.columns}), '.datatables-table-wrapper')
			.then((function() {
				dfd.resolve(this._api());
			}).bind(this));

		return dfd.promise();
	},

	_getResponsiveBreakpoints: function(opts) {
		var breakpoints = ([]).concat(responsive.breakpoints);

		opts.columns.forEach(function(columnObj) {
			if (columnObj.responsive && columnObj.responsive.width !== 0) {
				breakpoints.push({
					'name': columnObj.data + '-a',
					width: columnObj.responsive.width + 1
				});
				breakpoints.push({
					'name': columnObj.data + '-b',
					width: columnObj.responsive.width
				});

				columnObj["class"] = (columnObj["class"] || "") + " min-" + columnObj.data + '-a';
			}
		});

		return breakpoints;
	},

	_options: function() {
		var opts;

		if (this.$options.configKey) {
			opts = TN.config.table.data[this.$options.configKey];
		} else {
			var columnDef = [];

			this.$el.find('th').each((function(_i, el) {
				var $el = this.$tools.dom.find(el);
				var data = $el.data();
				var column = {
					name: data.name,
					title: data.title,
					data: data.data,
					type: data.type,
					orderable: data.sortable,
					width: data.width
				};

				column['class'] = data['class'];

				if (data.responsiveWidth) {
					column.responsive = {
						width: data.responsiveWidth
					};
				}

				if (data.responsiveWidth === 0) {
					$el.addClass('all');
				}

				columnDef.push(column);
			}).bind(this));

			opts = {
				columns: columnDef,
				url: this.$options.url,
				pageLength: this.$options.pageSize,
				ordering: this.$options.sortable,
				oLanguage: {
					sEmptyTable: this.$options.noRecordsText,
					sZeroRecords: this.$options.noRecordsText
				}
			};

			if (typeof this.$options.orderStart !== 'undefined') {
				opts.order = [this.$options.orderStart, this.$options.orderDirection || 'asc'];
			}
		}

		opts.columns.forEach(function(columnObj, index) {
			if (typeof columnObj.type !== 'undefined') {
				columnObj.render = defaultRenderers[columnObj.type].bind(defaultRenderers, columnObj.params);

				if (columnObj.type === 'checkbox' || columnObj.type === 'expand') {
					columnObj.createdCell = function(td) {
						td.setAttribute('data-prevented-row-selection', 'true');
					};
				}
			}
		});

		opts.maxResponsiveWidth = opts.columns.reduce(function(max, column) {
			if (!column.responsive) {
				return max;
			}

			return max < column.responsive.width ? column.responsive.width : max;
		}, 0);

		return opts;
	},

	_api: function() {
		var dataTables = this._$().find('table:first').DataTable(this.options);
		var dataTablesAPI = this._$().find('table:first').dataTable().api();
		return new ApiWrapper(dataTablesAPI);
	},

	_onDraw: function($ev) {
		setTimeout(this._updateComponents.bind(this), 0);

		$ev.stopPropagation();
	},

	_markRowAsLoaded: function(row) {
		row.setAttribute('loaded', true);
	},

	_updateComponents: function() {
		var cells = this.$el.find('table:first > tbody > tr:not([loaded]) td').toArray();

		if (!cells.length) {
			return;
		}

		cells = cells.map(function(cell) {
			return {
				el: cell,
				html: cell.innerHTML
			};
		});

		cells.forEach(function(cell) {
			this._markRowAsLoaded(cell.el);

			while(this.$tools.dom.find('#cell-' + cellId).length) {
				++cellId;
			}

			cell.el.setAttribute('id', 'cell-' + cellId);

			cell.el.innerHTML = '';
		}.bind(this));

		this._updateCells(cells[0], 0, cells);
	},

	_updateCells: function(cell, index, cells) {
		var dfd;

		dfd = this.html(cell.html, '#' + cell.el.getAttribute('id'));

		++index;

		if (index === cells.length) {
			dfd.finally(function() {
				this.$events.trigger('drawed');
			}.bind(this));
		} else {
			dfd.finally(this._updateCells.bind(this, cells[index], index, cells));
		}
	},

	_reload: function() {
		var instance = this._$().find('table:first').DataTable();

		instance.ajax.reload();
	},

	_toggleFirst: function() {
		this.$components.loader.hide();
		this.show('table:first-child');
	},
	/*
	This is an isolation for jquery usage. Must be removed once datatables
	re-implemented and don't need jQuery anymore
	*/
	_$: function(){
		return $(this.$el[0]);
	}
};
