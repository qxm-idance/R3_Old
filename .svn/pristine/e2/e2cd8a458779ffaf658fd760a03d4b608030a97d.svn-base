var dropdown = require('Framework/dropdown');
var selectDropdown = Object.create(dropdown);

selectDropdown.events = app.core.util.extend({}, dropdown.events, {
	'change select': '_onSelectChange'
});

selectDropdown.initialize = function() {
	// init parent
	dropdown.initialize.call(this);

	this.$select = this.$el.find('select');
	this.$label = this.$el.find('[data-selector="label"]');
	this.initVal = this.getValue();
	// update currently displayed label
	this._updateSelected();
};
/**
	desc: Gets current value
*/
selectDropdown.getValue = function() {
	return this.$select.val();
};

/**
	desc: Gets text of selected option
*/
selectDropdown.getCurrentOption = function() {
	return this.$select.find(':selected');
};

/**
	desc: Gets text of selected option
*/

selectDropdown.getCurrentText = function() {
	return this.getCurrentOption().text();
};

/**
	desc: Gets HTML of selected option
*/
selectDropdown.getCurrentHtml = function() {
	var currentValue = this.getValue();
	var currentItem = this.$el.find('li[data-value="' + currentValue + '"] [data-selector="option-label"]');
	return currentItem.html();
};

// protected methods
selectDropdown._updateSelected = function() {
	this.$label.html(this.getCurrentHtml());
};

selectDropdown._onSelectChange = function(e) {
	var value = e.currentTarget.value;
	this._updateSelected();
	this.$events.trigger('change', value);
	this.close();
};

selectDropdown._onChooseOption = function(e) {
	if (this.$options.preventDefault === true) {
		e.preventDefault();
	}

	var value = e.currentTarget.dataset.value || "";
	if (value !== this.getValue()) {
		this.$select.val(value);
		this._updateSelected();
		this.$events.trigger('change', value);
	}

	this.toggle();
};

/**
	name: select-dropdown
	type: ui
	desc: select with html-enabled options
	events:
		change: fires when state is changed. Supplies value
		open: Fires when dropdown was shown.
		close: Fires when dropdown was hidden.

	options:
		preventDefault: prevent native browser event handling
*/

module.exports = selectDropdown;
