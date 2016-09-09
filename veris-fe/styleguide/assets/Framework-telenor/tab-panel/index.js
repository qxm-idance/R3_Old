var SELECTORS = {
	tab: '.tabpanel__tab',
	ignoreTab: '.tabpanel__ignore',
	tabTrigger: 'a',
	tabsSelectWrapper: '.tabpanel__select',
	tabsSelectNative: '.tabpanel__select select',
	tabGroup: '[data-tab-group]',
	contentList: '.tabpanel__list',
	contentPanel: '.tabpanel__panel',
	flexnavTab: '.flexnav',
	flexnavDropdown: '.flexnav__subnav',
	flexnavToggler: '.flexnav__toggler',
	flexnavAnchor: '.flexnav--anchor'
};

var MODIFIERS = {
	active: 'is-active',
	disabled: 'is-disabled',
	flexnavInvisible: 'flexnav--invisible',
	flexnavSet: 'flexnav--inited',
	flexnavActive: 'flexnav--active-tab'
};

var CLASSES = {
	hidden: 'js-hidden'
};

/**
name: Tab Panel
type: ui
desc: |
		Implementation of tab panel component. Renders tabs (or other variants of triggers) with only one active content.
		Content will be switched by click on tab (checkbox, radio button, link, select).

		specific tab can be opened on page loading by adding hash with tab ID to the query string (e.g. #tabID)
		use "tab--" prefix to prevent default page scrolling (e.g. #tab--tabID)

options:
		tabTarget: String. Specifies JQuery selector for tab trigger. Default - 'a'.

*/
module.exports = {
		initialize: function() {
			this._hasSelect = this.$el.find(SELECTORS.tabsSelectWrapper).length > 0;

			this.tabTrigger = this.$options.tabTarget || SELECTORS.tabTrigger;

			this._setupElements();
			this._bindHandlers();
			this._checkHash();

			this._isFlexnavEnabled = (typeof this.$options.flex === 'undefined') || this.$options.flex === true;
			if (this._isFlexnavEnabled) {
				this.flexnav = null;
				this.subnav = null;
				this.isUpdating = false;
				this.isOpen = false;

				this._addFlexnav();
				this._updateFlexNavigation();
				this.$tools.dom.find(window).on('resize', this.$tools.helper.throttle(this._onWindowResize.bind(this), 200));
			}
		},
		events: {
			'change .tabpanel__select select': '_onSelectChange'
		},
		/**
	 desc: Activates tab and shows related content by specified JQuery object for this tab.
	 args:
			$tab: JQuery object of tab that should be activated.
			fromSelect: Boolean. Pass `true` to specify that tab is activated by `select` change.
	 */
		changeTab: function($tab, fromSelect) {
				this._setActiveTab($tab);
				this._setActivePanel(this.$el.find('#' + this._getId($tab)));

				// update select
				if (this._hasSelect && !fromSelect) {
						this._updateSelect(this._getId($tab));
				}
		},
		_setupElements: function() {
		// find controls
		this.$tabs = this._getFirstLevelChildren(SELECTORS.tab).not(SELECTORS.ignoreTab);
				this.$tabLinks = this._getFirstLevelChildren(this.tabTrigger, this.$tabs);
				this.$groupLinks = this._getFirstLevelChildren(SELECTORS.tabGroup);
				this.$panels = this._getFirstLevelChildren(SELECTORS.contentPanel);

				// Set the active tab.
				var $activeTab = this.$tabs.filter('.' + MODIFIERS.active).find(this.tabTrigger);

				// If no tab is selected, make the first tab selected by default.
				if (!$activeTab.length) {
						$activeTab = this.$tabs.first().find(this.tabTrigger);
				}

		// activate tab
				this.changeTab($activeTab, false);
		},
		_bindHandlers: function() {
				this.$tabs.each(function(i, el) {
					var $tab = this.$el.find(el);
					var $link = $tab.find(this.tabTrigger);
					var $groupLink =  this.$groupLinks.filter('[data-tab-group="'+ this._getId($link) +'"]');

					$link.on('click.tabpanel', this._tabClickHandler.bind(this));

					$tab.add($groupLink).on('click', function() {
							$link.trigger('click.tabpanel');
					});
				}.bind(this));
		},
		_tabClickHandler: function(e) {
			// cancel if disabled
			var $tabTrigger = this.$el.find(e.currentTarget);
			var $tab = $tabTrigger.closest(SELECTORS.tab);

			if ($tab.hasClass(MODIFIERS.disabled)) {
				return;
			}

			if ($tab.parents(SELECTORS.flexnavDropdown).length) {
				$tab.addClass(MODIFIERS.flexnavActive);
				var $origin = $tab.origin();

				if ($origin.length) {
					$tabTrigger = $origin.find(this.tabTrigger);
				}
			}

			this._closeFlexnavDropdown();
			this.changeTab($tabTrigger);

			return false;
		},
		_checkHash: function() {
				var hash = document.location.hash;
				if (hash) {
						var $tab = this.$tabLinks.filter('[href="' + hash.replace('tab--', '') + '"]');
						if ($tab.length) {
								this.changeTab($tab, false);
						}
				}
		},
		_setActiveTab: function($activeTab) {
			this.$activeTab = $activeTab.parent();
			this.$tabLinks.parent().removeClass(MODIFIERS.active);
			this.$groupLinks.removeClass(MODIFIERS.active);

			$activeTab.parent().addClass(MODIFIERS.active);
			if (this.$groupLinks.length) {
					this.$groupLinks.filter('[data-tab-group="' + this._getId($activeTab) + '"]')
					.addClass(MODIFIERS.active);
			}
		},
		_setActivePanel: function($activePanel) {
			this.$panels.removeClass(MODIFIERS.active)
				.addClass(CLASSES.hidden);
			$activePanel.addClass(MODIFIERS.active)
				.removeClass(CLASSES.hidden);

			this.$events.trigger('panelChanged');
		},
		_onSelectChange: function(e) {
			var $selected = this.$el.find(SELECTORS.tabsSelectNative).find(':selected');
			this.changeTab(this.$el.find('.tabpanel__tab a[href="#' + $selected.val() + '"]'), true);
		},
		_updateSelect: function(tabId) {
			this.$el.find(SELECTORS.tabsSelectNative).val(tabId);
			this.$el.find(SELECTORS.tabsSelectNative).trigger('change');
		},
		_getId: function($el) {
			if ($el.attr('href')) {
					return $el.attr('href').substring(1);
			}

			return 0;
		},
	_getFirstLevelChildren: function(selector, context) {
		context = context || this.$el;
		var firstChild = context.find(selector + ':first');
		var siblings = firstChild.siblings(selector);
		return siblings.add(firstChild);
	},

	// Methods for flexible navigation
	_onWindowResize: function() {
		if (!this.isUpdating) {
			this.subnavTabs.eq(this.$activeTab.index()).addClass(MODIFIERS.flexnavActive);
			this._updateFlexNavigation();
		}
	},
	_updateFlexNavigation: function() {
		this.isUpdating = true;

		// escape if element or parent is not displayed
		if (!this.$el.outerWidth() || !this._getAvailableWidth()) {
			this.isUpdating = false;
			return;
		}

		// reset flexnav if we don't need it
		if (this.$el.outerWidth(true) >= this._getMainTabsWidth()) {
			this.$tabs.removeClass(MODIFIERS.flexnavInvisible);
			this.subnavTabs.addClass(MODIFIERS.flexnavInvisible);
			this.flexnav.hide();
			this.isUpdating = false;
			return;
		}

		this._resetFlexnavTabs();
		this._adjustActiveTab();
		this._showSiblingTabs();

		// deactivate tab in flexnav
		this.subnavTabs.filter('.' + MODIFIERS.flexnavActive)
			.removeClass(MODIFIERS.flexnavActive)
			.addClass(MODIFIERS.flexnavInvisible);

		// check visibility of flexnav tab
		var showFlexNav = this.$tabs.filter('.' + MODIFIERS.flexnavInvisible).length > 0;
		this.flexnav.toggle(showFlexNav);
		this.$el.find(SELECTORS.flexnavAnchor).toggleClass(MODIFIERS.flexnavSet, showFlexNav);

		this.isUpdating = false;
	},
	_showSiblingTabs: function(){
		this.$tabs.each(function(index, el){
			if(el == this.$activeTab[0]){
				return;
			}

			var $tab = this.$tabs.eq(index);
			var $subTab = this.subnavTabs.eq(index);

			if(this._isTabFitToWidth($tab)){
				$tab.removeClass(MODIFIERS.flexnavInvisible);
				$subTab.addClass(MODIFIERS.flexnavInvisible);
			}
		}.bind(this));
	},
	_isTabFitToWidth: function($tab){
		var tabWidth = $tab.outerWidth(true);

		return this._getAvailableWidth() > (this._getVisibleTabsWidth() + tabWidth);
	},
	_adjustActiveTab: function(){
		this.$activeTab.css({width: ''});
		this.flexnav.css({width: ''});

		window.requestAnimationFrame(function() {
			this.flexnav.css({width: this.flexnav.outerWidth(true)});

			var isTabWider = this._getAvailableWidth() < this.$activeTab.outerWidth(true);

			if(isTabWider) {
				this.$activeTab.outerWidth(this._getAvailableWidth());
			}
		}.bind(this));
	},
	_getAvailableWidth: function() {
		return this.$el.outerWidth(true) - this.flexnav.outerWidth(true);
	},
	_getMainTabsWidth: function() {
		var width = 0;

		this.$tabs.each(function(index, el) {
			width += this.$el.find(el).outerWidth(true);
		}.bind(this));

		return width;
	},
	_getVisibleTabsWidth: function() {
		var width = 0;

		this.$tabs.filter(':not(.flexnav, .' + MODIFIERS.flexnavInvisible + ')').each(function(index, el) {
			width += this.$el.find(el).outerWidth(true);
		}.bind(this));

		return width;
	},
	_addFlexnav: function() {
		var flexnavTemplate = this.$tools.template.parse(require('./html/flexnav.html'));

		if (!this.flexnav) {
			this.$tabs.last().after(flexnavTemplate({ moreText: this.$options.moreText || 'More' }));

			this.flexnav = this.$el.find(SELECTORS.flexnavTab);
			this.subnav = this.$el.find(SELECTORS.flexnavDropdown);

			this.flexnav.hide();

			this.subnav.append(this.$tabs.clone());
			this.subnavTabs = this.subnav.find('li');

			this.$el.find(SELECTORS.flexnavToggler).click(this._toggleFlexnavDropdown.bind(this));
			this.subnavTabs.find(this.tabTrigger).click(this._flexnavTabClickHandler.bind(this));
			this.subnavTabs.filter('.' + MODIFIERS.active).addClass(MODIFIERS.flexnavActive).removeClass(MODIFIERS.active);
		}
	},
	_flexnavTabClickHandler: function(e) {
		this._tabClickHandler(e);
		this._updateFlexNavigation();
		return false;
	},
	_resetFlexnavTabs: function() {
		this.$tabs.css({width: ''});

		this.$tabs.removeClass(MODIFIERS.flexnavInvisible);
		this.$tabs.not('.' + MODIFIERS.active).addClass(MODIFIERS.flexnavInvisible);
		this.subnavTabs.not('.' + MODIFIERS.flexnavActive).removeClass(MODIFIERS.flexnavInvisible);
	},
	_openFlexnavDropdown: function() {
		this.isOpen = true;
		this.$el.find('.flexnav').addClass('is-open');

		// add global listener to close when clicked outside
		this.$tools.dom.find(window).on('touchstart', this.onGlobalClick.bind(this));
		this.$tools.dom.find('html').on('click', this.onGlobalClick.bind(this));
	},
	_closeFlexnavDropdown: function() {
		this.isOpen = false;
		this.$el.find('.flexnav').removeClass('is-open');

		// remove global listener
		this.$tools.dom.find(window).off('touchstart');
		this.$tools.dom.find('html').off('click');
	},
	_toggleFlexnavDropdown: function() {
		if (this.isOpen) {
			this._closeFlexnavDropdown();
		} else {
			this._openFlexnavDropdown();
		}
		return false;
	},
	onGlobalClick: function(e) {
		if (!this.$tools.dom.find(e.target).parents('.flexnav').length && this.isOpen) {
			this._closeFlexnavDropdown();
		}
		else if (this.$options.closeOnChildClick && this.isOpen && this.$tools.dom.find(e.target).parents('.flexnav__subnav').length) {
			this.$tools.dom.find(window).off('touchstart');
			this.$tools.dom.find('html').off('click');
			this._closeFlexnavDropdown();
		}
	}
};
