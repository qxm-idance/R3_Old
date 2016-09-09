var SELECTORS = {
	checkboxes: 'input[type="checkbox"]',
	checkeds: 'input[type="checkbox"]:checked',
	groupCheckboxes: '[data-selector="groupCheckboxes"]'
};

module.exports = {
	events: {
		'click $apply': '_apply',
		'open $this': '_saveState',
		'close $this': '_resetState',
		'change [data-inside-group]': '_insideCheckboxChanged',
		'change [data-group-name]': '_groupCheckboxChnaged'
	},

	initialize: function() {
		this._state = {};
	},

	ready: function() {
		this._updateGroups();
	},

	getInputs: function() {
		return this.$el.find(SELECTORS.checkboxes).toArray();
	},

	getCheckedInputs: function() {
		return this.$el.find(SELECTORS.checkeds).toArray();
	},

	_updateGroups: function() {
		var grouped = this.$el.find(SELECTORS.groupCheckboxes).toArray();

		grouped.forEach(function(checkbox) {
			this._updateGroup(checkbox.getAttribute('data-group-name'));
		}.bind(this));
	},

	_updateGroup: function(groupName) {
		var $checkbox = this.$el.find('[data-group-name="' + groupName + '"]');
		var innerCheckboxes = this.$el.find('[data-inside-group="' + groupName + '"]').toArray();

		var checked = innerCheckboxes.reduce(function(val, checkbox) {
			return val && checkbox.checked;
		}, true);

		$checkbox.prop('checked', checked);
	},

	_groupCheckboxChnaged: function($ev) {
		var target = $ev.currentTarget;
		var inner = this.$el.find('[data-inside-group="' + target.getAttribute('data-group-name') + '"]').toArray();

		inner.forEach(function(checkbox) {
			checkbox.checked = target.checked;
		});
	},

	_insideCheckboxChanged: function($ev) {
		var target = $ev.currentTarget;

		this._updateGroup(target.getAttribute('data-inside-group'));
	},

	_apply: function() {
		this._triggerChange();

		this.$events.trigger('apply');
	},

	_triggerChange: function() {
		this._saveState();

		this.$events.trigger('change');
	},

	_saveState: function() {
		var checkboxes = this.getInputs();

		this._state = {};

		checkboxes.forEach(function(checkbox) {
			this._state[checkbox.getAttribute('name')] = checkbox.checked;
		}.bind(this));
	},

	_resetState: function() {
		var checkboxes = this.getInputs();

		checkboxes.forEach(function(checkbox) {
			checkbox.checked = this._state[checkbox.getAttribute('name')];
		}.bind(this));
	}
};
