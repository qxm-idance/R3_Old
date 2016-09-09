var $ = require('jquery');

$.extend($.fn.dataTable.ext.internal, {
	_fnAjaxUpdate: function( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			$.fn.dataTable.ext.internal._fnProcessingDisplay( settings, true );
	
			$.fn.dataTable.ext.internal._fnBuildAjax(
				settings,
				$.fn.dataTable.ext.internal._fnAjaxParameters( settings ),
				function(json) {
					$.fn.dataTable.ext.internal._fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	},
	_fnAjaxUpdateDraw: function( settings, json ) {
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
		var loadMore        = compat( 'bLoadMore',            'loadMore' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		if (!settings.bLoadMore) {
			$.fn.dataTable.ext.internal._fnClearTable( settings );
		}

		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		var data = $.fn.dataTable.ext.internal._fnAjaxDataSrc( settings, json );
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			$.fn.dataTable.ext.internal._fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		$.fn.dataTable.ext.internal._fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			$.fn.dataTable.ext.internal._fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		$.fn.dataTable.ext.internal._fnProcessingDisplay( settings, false );
	},
	_fnDraw: function( oSettings ) {
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = $.fn.dataTable.ext.internal._fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			$.fn.dataTable.ext.internal._fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = $.fn.dataTable.ext.internal._fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			$.fn.dataTable.ext.internal._fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !$.fn.dataTable.ext.internal._fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					$.fn.dataTable.ext.internal._fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				$.fn.dataTable.ext.internal._fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  $.fn.dataTable.ext.internal._fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': $.fn.dataTable.ext.internal._fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		$.fn.dataTable.ext.internal._fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			$.fn.dataTable.ext.internal._fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		$.fn.dataTable.ext.internal._fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			$.fn.dataTable.ext.internal._fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		$.fn.dataTable.ext.internal._fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	},
	_fnPageChange: function( settings, action, redraw ) {
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();

		settings.bLoadMore = false;
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "loadmore" )
		{
			if ( start + len < records )
			{
				start += len;
				settings.bLoadMore = true;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			$.fn.dataTable.ext.internal._fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			$.fn.dataTable.ext.internal._fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				$.fn.dataTable.ext.internal._fnDraw( settings );
			}
		}
	
		return changed;
	}
});

$.extend($.fn.dataTable.ext.pager, {
	simple_numbers: function( page, pages ) {
		return [ 'previous', $.fn.dataTable.ext.pager._numbers(page, pages), 'next', 'loadmore' ];
	}
})

$.extend($.fn.dataTable.ext.renderer, {
	pageButton: {
		_: function(settings, host, idx, buttons, page, pages) {
			var classes = settings.oClasses;
			var lang = settings.oLanguage.oPaginate;
			var btnDisplay, btnClass, counter = 0;

			var attach = function(container, buttons) {
				var i, ien, node, button;
				var clickHandler = function(e) {
					$.fn.dataTable.ext.internal._fnPageChange(settings, e.data.action, true);
				};

				for (i = 0, ien = buttons.length; i < ien; i++) {
					button = buttons[i];

					if (Array.isArray(button)) {
						var inner = $('<' + (button.DT_el || 'div') + '/>')
							.appendTo(container);
						attach(inner, button);
					} else {
						btnDisplay = '';
						btnClass = '';

						switch (button) {
							case 'ellipsis':
								container.append('<span>&hellip;</span>');
								break;

							case 'first':
								btnDisplay = lang.sFirst;
								btnClass = button + (page > 0 ?
									'' : ' ' + classes.sPageButtonDisabled);
								break;

							case 'previous':
								btnDisplay = lang.sPrevious;
								btnClass = button + (page > 0 ?
									'' : ' ' + classes.sPageButtonDisabled);
								break;

							case 'next':
								btnDisplay = lang.sNext;
								btnClass = button + (page < pages - 1 ?
									'' : ' ' + classes.sPageButtonDisabled);
								break;

							case 'last':
								btnDisplay = lang.sLast;
								btnClass = button + (page < pages - 1 ?
									'' : ' ' + classes.sPageButtonDisabled);
								break;

							case 'loadmore':
								btnDisplay = 'More';
								btnClass = button + (page < pages - 1 ?
									'' : ' ' + classes.sPageButtonDisabled);
								break;

							default:
								btnDisplay = button + 1;
								btnClass = page === button ?
									classes.sPageButtonActive : '';
								break;
						}

						if (btnDisplay) {
							node = $('<a>', {
									'class': classes.sPageButton + ' ' + btnClass,
									'aria-controls': settings.sTableId,
									'data-dt-idx': counter,
									'tabindex': settings.iTabIndex,
									'id': idx === 0 && typeof button === 'string' ?
										settings.sTableId + '_' + button : null
								})
								.html(btnDisplay)
								.appendTo(container);

							node.bind( 'click.DT', {action: button}, function(e) {
								node.blur();
								clickHandler(e);
							})

							counter++;
						}
					}
				}
			};

			// IE9 throws an 'unknown error' if document.activeElement is used
			// inside an iframe or frame. Try / catch the error. Not good for
			// accessibility, but neither are frames.
			try {
				// Because this approach is destroying and recreating the paging
				// elements, focus is lost on the select button which is bad for
				// accessibility. So we want to restore focus once the draw has
				// completed
				var activeEl = $(document.activeElement).data('dt-idx');

				attach($(host).empty(), buttons);

				if (activeEl !== null) {
					$(host).find('[data-dt-idx=' + activeEl + ']').focus();
				}
			} catch (e) {}
		}
	}
});