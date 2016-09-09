var SELECTORS = {
	openner: '[data-selector="openner"]'
};

module.exports = {
	events: {
		'change $speech': '_filterChanged',
		'apply $speech': '_apply'
	},

	ready: function() {
		//For some reason we can't get access to this component inside _updateOpenner method, so we should cache one
		this._speech = this.$components.speech;
		this._updateOpenner();
	},

	filters: function() {
		return [{
			type: 'multi',
			name: this.$options.column,
			value: this._speech.getCheckedInputs().map(function(element) {
				return element.value;
			})
		}];
	},

	destroy: function() {},

	_filterChanged: function() {
		this._updateOpenner();
		this.$events.trigger('filterChanged');
	},

	_updateOpenner: function() {
		var checkeds = this._speech.getCheckedInputs();
		var $openner = this.$el.find(SELECTORS.openner);
		var text;
		var checkboxes;

		if (!checkeds.length) {
			$openner.text(this.$options.noItemsText);

			return;
		}

		checkboxes = this._speech.getInputs();

		if (checkeds.length === checkboxes.length) {
			$openner.text(this.$options.allText);

			return;
		}

		text = checkeds.map(function(element) {
			return element.getAttribute('name');
		}).join(', ');

		$openner.text(text);
	},

	_apply: function() {
		this.$events.trigger('close');
	}
};
