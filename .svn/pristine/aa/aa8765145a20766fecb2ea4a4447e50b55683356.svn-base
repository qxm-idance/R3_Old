var DEFAULT_CONTROL_GROUPS = ['exclusiveAction'];

/**
name: Exclusive Action
type: ui
desc: >
	It's a kind of container component that helps to prevent actions on all buttons in specified groups
	except the button that actually do some action. All non-active buttons will be disabled till
	current action finished. This component could be used as extension or as ignored component to prevent
	breaking of components hierarchy.

	NOTES!
		* Currently this component process only buttons.
		* It search only first-descendant buttons
		* It doesn't save current state of buttons before disabling

options:
	controlGroups: >
		Specifies comma-separated list of Aura components groups which should be processed together.
		Group `exclusiveAction` is processed by default.
 */
module.exports = {
	ready: function() {
		this.groups = DEFAULT_CONTROL_GROUPS;
		var events = {};

		if (this.$options.controlGroups) {
			this.groups = this.$options.controlGroups.split(',').reduce(function(groups, currentGroup) {
				return groups.concat(currentGroup.trim());
			}, this.groups);
		}

		this.groups.forEach(function(group) {
			events['click $$' + group] = '_onControlClick';
		});

		this.events = events;
	},
	_onControlClick: function(e) {
		e.data.component.activityIndicator();

		e.data.component.$events.one('actionFinished', function() {
			this._processControls(this._enableControlsCallback);
		}.bind(this));

		this._processControls(this._disableControlsCallback);
	},
	_processControls: function(callback) {
		this.groups.filter(function(group) {
			return !!this.$components[group];
		}.bind(this)).forEach(function(group) {
			this.$components[group].forEach(callback);
		}.bind(this));
	},
	_disableControlsCallback: function(control) {
		if (control.isLoading && !control.isLoading()) {
			control.disable();
		}
	},
	_enableControlsCallback: function(control) {
		control.enable && control.enable();
	}
};