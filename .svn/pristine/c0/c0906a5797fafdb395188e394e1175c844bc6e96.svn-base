var pagerTemplate = app.core.template.parse(require('./html/pager.html'));
var pageButtonTemplate = app.core.template.parse(require('./html/page-button.html'));
var ellipsisTemplate = app.core.template.parse(require('./html/ellipsis.html'));

var MODIFIERS = {
	activePage: 'current',
	navDisabled: 'disabled'
};

var ACTIVE_PAGES_LIMIT = 5;

/**
name: Pager
type: ui
desc: Implementation of component for pagination
options:
	pageSize: Specifies numbers of items on one page
	totalCount: Specifies total number of items
events:
	pageChanged: Fires when page was changed in any way (next, previous, click on specific page). Passes new page number as argument.
*/
module.exports = {
	initialize: function() {
		if (window.innerWidth < 767) {
			ACTIVE_PAGES_LIMIT = 3;
		}

		this.updateSettings(this.$options.pageSize, this.$options.totalCount);
	},
	events: {
		'click pageButton': '_onPageClick',
		'click pagePrevious': '_onPreviousPageClick',
		'click pageNext': '_onNextPageClick'
	},
	/**
        desc: Updates component settings and resets component markup.
        args:
            pageSize: Specifies numbers of items on one page.
            totalCount: Specifies total number of items.
            pageNumber: Specifies selected page.
	 */
	updateSettings: function(pageSize, totalCount, pageNumber) {
		this.$options.pageSize = window.parseInt(pageSize);
		this.$options.totalCount = window.parseInt(totalCount);
		this.$options.pageNumber = window.parseInt(pageNumber || this.$options.pageNumber || 1);

		if (this._isSinglePage()) {
			this.$el.hide();
			return;
		} else {
			this.$el.show();
		}

		this.pagesCount = Math.ceil(this.$options.totalCount / this.$options.pageSize);

		this._resetMarkup(this.$options.pageNumber);
	},
	_resetMarkup: function(activePageNumber) {
		if (!this.$elements.pages || !this.$elements.pages.length) {
			this.html(pagerTemplate())
				.then(this._initPagesMarkup.bind(this, activePageNumber));
		} else {
			this._initPagesMarkup(activePageNumber);
		}
	},
	_initPagesMarkup: function(activePageNumber) {
		var pagerProperties = this._calculatePagerProperties(activePageNumber);
		var pagesHtml = '';

		this.$elements.pages.empty();

		if (pagerProperties.startEllipsis) {
			pagesHtml += pageButtonTemplate({
				pageNumber: 1
			});
			pagesHtml += ellipsisTemplate();
		}

		for (var i = pagerProperties.startPage; i < pagerProperties.endPage; i++) {
			pagesHtml += pageButtonTemplate({
				pageNumber: i
			});
		}

		if (pagerProperties.endEllipsis) {
			pagesHtml += ellipsisTemplate();
			pagesHtml += pageButtonTemplate({
				pageNumber: this.pagesCount
			});
		}

		this.html(pagesHtml, this.$elements.pages)
			.then(this._setButtonsActivityState.bind(this, activePageNumber));
	},
	_calculatePagerProperties: function(activePageNumber) {
		activePageNumber = activePageNumber || 1;

		// default settings if total number of pages is less then pages limit
		var startPageIndex = 1;
		var endPageIndex = this.pagesCount + 1;
		var addStartEllipsis = activePageNumber > ACTIVE_PAGES_LIMIT;
		var addEndEllipsis = false;

		if (this.pagesCount > ACTIVE_PAGES_LIMIT) {
			if (activePageNumber <= ACTIVE_PAGES_LIMIT || this.pagesCount === ACTIVE_PAGES_LIMIT + 1) {
				startPageIndex = 1;
			} else if (activePageNumber + ACTIVE_PAGES_LIMIT > this.pagesCount) {
				startPageIndex = this.pagesCount - ACTIVE_PAGES_LIMIT + 1;
			} else {
				startPageIndex = Math.ceil(activePageNumber - ACTIVE_PAGES_LIMIT / 2);
			}

			endPageIndex = startPageIndex + ACTIVE_PAGES_LIMIT;
			if (startPageIndex + ACTIVE_PAGES_LIMIT > this.pagesCount) {
				endPageIndex = this.pagesCount + 1;
			}

			if (this.pagesCount === ACTIVE_PAGES_LIMIT + 1) {
				addStartEllipsis = false;
				addEndEllipsis = false;
				endPageIndex++;
			} else if (activePageNumber <= ACTIVE_PAGES_LIMIT) {
				addEndEllipsis = true;
			} else if (activePageNumber <= (this.pagesCount - ACTIVE_PAGES_LIMIT)) {
				addEndEllipsis = true;
			}
		}

		return {
			activePage: activePageNumber,
			startPage: startPageIndex,
			endPage: endPageIndex,
			startEllipsis: addStartEllipsis,
			endEllipsis: addEndEllipsis
		}
	},
	_onPageClick: function(e) {
		this.$elements.pageButton.removeClass(MODIFIERS.activePage);
		e.currentTarget.classList.add(MODIFIERS.activePage);
		this._goToPage(this._getCurrentPageNumber());
		return false;
	},
	_onPreviousPageClick: function() {
		var currentPage = this._getCurrentPageNumber();
		if (currentPage > 1) {
			this._goToPage(currentPage - 1);
		}
	},
	_onNextPageClick: function() {
        var currentPage = this._getCurrentPageNumber();
		if (currentPage < this.pagesCount) {
			this._goToPage(currentPage + 1);
		}
	},
	_goToPage: function(pageNumber) {
		this._resetMarkup(pageNumber);
		this.$events.trigger('pageChanged', pageNumber);
	},
	_getCurrentPageNumber: function() {
		var $currentPageButton = this.$elements.pageButton.filter('.' + MODIFIERS.activePage);
		return $currentPageButton.length ? window.parseInt($currentPageButton.data('pageNumber')) : 1;
	},
	_setButtonsActivityState: function(activePageNumber) {
		this.$elements.pageButton.removeClass(MODIFIERS.activePage);
		this.$elements.pageButton.filter('[data-page-number="' + activePageNumber + '"]').addClass(MODIFIERS.activePage);
		this.$elements.pagePrevious.toggleClass(MODIFIERS.navDisabled, activePageNumber < 2);
		this.$elements.pageNext.toggleClass(MODIFIERS.navDisabled, activePageNumber >= this.pagesCount);
	},
    _isSinglePage: function() {
        return !this.$options.pageSize || !this.$options.totalCount || Math.ceil(this.$options.totalCount / this.$options.pageSize) <= 1;
    }
};
