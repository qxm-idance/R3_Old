var scrollTo = require('jquery.scrollTo');

/**
	name: Autocomplete
	type: ui
	desc: >
		Autocomplete

		Response example:

		```js
			{
				"success": true,
				"data": [
					{"label": "Alabama", "value": "Alabama"},
					{"label": "Alaska", "value": "Alaska"},
					{"label": "Arizona", "value": "Arizona"},
					{"label": "Arkansas", "value": "Arkansas"},
					{"label": "California", "value": "California"}
				]
			}
		```
	options:
		autocompleteSource: ID of an element used as autocomplete dropdown
		autocompleteUrl: URL to fetch data from autocomplete
		payload: If option starts with *payload* followed by another autocomplete alias, that autocomplete value is added to the request.
	events:
		valueWillSet: >
			Fires when input value is about to change. Additional param is passed, containing current value and mutate function, that allows to change the value
*/
module.exports = {
	initialize: function() {
		this.$container = this.$el.parent().addClass(this.options.parentClass);
		this.$container.on('keydown', this.onKeydown.bind(this));
		this.$container.on('focusout', this.onFocusout.bind(this));

		this.$el.attr('autocomplete', 'off');

		this.isCollapsed = true;

		if (this.$options.autocompleteSource) {
			this.$dropdown = this.$container.find('#' + this.$options.autocompleteSource);
		} else {
			this.$dropdown = this.$container.find(this.options.dropdownSelector);
		}

		if (!this.$dropdown.length) {
			this.$el.after(this.options.dropdownTemplate);
			this.$dropdown = this.$container.find(this.options.dropdownSelector);
		}

		this.$dropdownList = this.$dropdown.find(this.options.dropdownListSelector);
		this.$dropdownList.on('click', 'a', this.onItemLinkClick.bind(this));

		this.$events.on('typeWatch', this._search.bind(this));
	},
	processors: {},
	cachedValues: {},
	previousValue: {},
	options: {
		parentClass: 'autocomplete',
		openClass: 'is-open',
		dropdownSelector: '.dropdown__content',
		dropdownListSelector: '.dropdown__list',
		dropdownListItemSelector: '.dropdown__list > li',
		dropdownListItemLabelSelector: '> a',

		dropdownTemplate: '<div class="dropdown__content" role="menu">' +
				'<div class="dropdown__scroll">' +
					'<ul class="dropdown__list" aria-live="polite">' +
					'</ul>' +
				'</div>' +
		'</div>',

		dropdownItemTemplate: '<li>' +
			'<a href="#" class="text-truncate">' +
			'</a>' +
		'</li>'
	},

	/**
		desc: Returns current value
	*/
	val: function() {
		return this.$el.val();
	},


	/**
		desc: Close autocomplete dropdown
	*/
	close: function() {
		this.isCollapsed = true;
		this.$container.removeClass('is-open');
		this.currentIndex = -1;

		this.$tools.dom.find(document).off('click.autocomplete');
	},

	/**
		desc: Open autocomplete dropdown
	*/
	open: function() {
		this.isCollapsed = false;
		this.$container.addClass('is-open');

		this.$tools.dom.find(document).on('click.autocomplete', (this.onClickOutside).bind(this));
	},
	setProcessors: function(processors) {
		this.processors = processors || {};
	},
	_search: function() {
		var currentValue = this.val();

		if (currentValue.length > 0 && currentValue !== this.previousValue) {
			if (!this.$options.autocompleteUrl) {
				this._searchInStaticSource();
			} else {
				this._loadData();
			}

			this.previousValue = currentValue;
		} else {
			this.close();
		}
	},
	_payload: function() {
		var obj = {
				query: this.val()
			},
			data = this.$options,
			key;

		for (var property in data) {
			if (property.indexOf('payload') === 0) {
				key = property.replace('payload', '');
				obj[key] = this.$tools.dom.find('#' + data[property]).val();
			}
		}

		return obj;
	},
	_loadData: function() {
		this.close();

		this.$dropdownList.empty();

		var ajaxConfig = {
			url: this.$options.autocompleteUrl || '',
			type: 'GET',
			data: this._payload(),
			success: (function(response) {
				if (response && response.data && Array.isArray(response.data)) {
					var itemsData = response.data;

					if (typeof this.processors.processResponseData === 'function') {
						itemsData = this.processors.processResponseData(itemsData);
					}

					this._setData(itemsData);
				}
			}).bind(this)
		};

		ajaxConfig = this.$tools.util.extend(true, ajaxConfig, this._callProcessor('getLoadDataConfig'));

		// check that 'query' param always exists
		if (!ajaxConfig.data.query) {
			ajaxConfig.data.query = this.$input.val();
		}

		this.$tools.data.ajax(ajaxConfig);
	},
	_setData: function(itemsData) {
		this.$dropdownList.empty();

		this.cachedValues = [];

		this.$tools.util.each(itemsData, (function(index, item) {
			if (item) {
				if (typeof item === 'object') {
					this._addItem(item.value, item.label);
				} else {
					this._addItem(item, item);
				}
			}
		}).bind(this));

		var hasVisibleItems = this._checkVisibilityState();

		if (hasVisibleItems) {
			this.$tools.data.pubsub.publish('autocomplete.items.found', this);
		} else {
			this.$tools.data.pubsub.publish('autocomplete.items.not.found', this);
		}
	},
	_addItem: function(value, label) {
		if (this.cachedValues.indexOf(value) === -1 && value && label) {
			this.$dropdownList.append(this.options.dropdownItemTemplate);

			var $item = this.$dropdownList
				.find('li')
				.last()
				.data('autocomplete-value', value);

			$item.find(this.options.dropdownListItemLabelSelector).html(label);

			this.cachedValues.push(value);
		}
	},
	_checkVisibilityState: function() {
		var $items = this.$dropdown.find(this.options.dropdownListItemSelector);

		if ($items.length > 0) {
			this.open();
			return true;
		} else {
			this.close();
			return false;
		}
	},
	_searchInStaticSource: function() {
	},
	_setValue: function(selectedItemIndex) {
		var $selectedItem = this.$dropdown.find(this.options.dropdownListItemSelector).eq(selectedItemIndex),
			label = $selectedItem.find(this.options.dropdownListItemLabelSelector).text(),
			value = $selectedItem.data('autocomplete-value') || label || '';

		this.previousValue = value;

		var inputVal = value;

		this.$events.trigger('valueWillSet', {
			value: inputVal,
			mutate: function(value) {
				inputVal = value
			}
		});

		this.$el.val(inputVal);
		this.$el.trigger('keyup');
		this.$el.focus();

		if (this.$options.alias) {
			this.$tools.data.pubsub.publish('autocomplete.changed', {
				value: value,
				label: label,
				alias: this.$options.alias,
				relatedFields: this.$options.relatedFields ? this.$options.relatedFields.split(',') : null
			});
		}
	},
	_callProcessor: function(processorName) {
		if (typeof this.processors[processorName] === 'function') {
			return this.processors[processorName]();
		}

		return {};
	},
	onItemLinkClick: function(e) {
		var $listItem = this.$tools.dom.find(e.currentTarget).closest(this.options.dropdownListItemSelector),
			$items = this.$dropdown.find(this.options.dropdownListItemSelector),
			index = $listItem.length ? $items.index($listItem[0]): -1;

		this._setValue(index);
		this.close();

		e.preventDefault();
		e.stopPropagation();
	},
	onFocusout: function() {
	},
	onKeydown: function(e) {
	if (this.isCollapsed) {
	  return;
	}

	if ([27, 38, 40, 13, 9].indexOf(e.which) === -1) {
	  return;
	}

	// Escape.
	if (e.which === 27) {
	  this.close();

	  return;
	}

		var $items = this.$dropdown.find(this.options.dropdownListItemSelector);

	// Tab
	if (e.which === 9 && this.currentIndex < 0 && $items.length) {
	  this.currentIndex = 0;
	}

		// Enter.
		if ((e.which === 13 || e.which === 9) && this.currentIndex >= 0) {
			this._setValue(this.currentIndex);
			this.close();

			e.preventDefault();
			e.stopPropagation();

			return;
		}

		// Up.
		if (e.which === 38 && this.currentIndex > 0) {
	  this.currentIndex--;
		}

		// Down.
		if (e.which === 40 && this.currentIndex < $items.length - 1) {
	  this.currentIndex++;
		}

	var current = $items.eq(this.currentIndex).find('> a');
	var scroller = this.$dropdown.find('.dropdown__scroll');
	var topShift = current.offset().top - scroller.offset().top;
	var bottomShift = topShift + current.outerHeight() - scroller.innerHeight();
	var currentscroll = scroller.offset().top - this.$dropdownList.offset().top;

	if (topShift < 0) {
	  scroller.scrollTo(topShift + currentscroll);
	}

	if (bottomShift > 0) {
	  scroller.scrollTo(bottomShift + currentscroll);
	}

	this.$dropdown.find('.current-autocomplete-option').removeClass('current-autocomplete-option');
	current.addClass('current-autocomplete-option');

		e.preventDefault();
		e.stopPropagation();
	},
	onClickOutside: function(e) {
		// Check that the click was made outside the dropdown.
		if (!this.$tools.dom.find(e.target).closest(this.options.dropdownSelector).length) {
			this.close();
		}
	}
};
