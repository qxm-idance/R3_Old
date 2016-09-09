var spinnerTemplate = require('./html/spinner.html');
var CLASSES = {
	disabled: 'form-select--disabled',
	busy: 'overlay-spinner--busy-mode'
};
/**
name: Select
type: ui
desc: Pretty wrapper for `<select>` component.
options:
	submit: Submits closest form if specified.
	ajax: Sends current data via AJAX-request by URL specified in this attribute.
events:
	change: Fires when value was changed. Current value will be passed to event handler.
 */
module.exports = {
	initialize: function() {
		this.$field = this.$el.find('.form-select__field');
		this.$select = this.$el.find('select');
		this.initVal = this.$select.val();

		this._updateSelected();
	},

	events: {
		'change select': '_onChange'
	},

	/**
	 desc: Selects first value.
	 */
	selectFirst: function() {
		var first = this.$tools.dom.find('option:first', this.$el);

		if (first.is(':selected')) {
			return;
		}

		this.$tools.dom.find('option', this.$el).prop('selected', false);
		first.prop('selected', true);

		this._onChange();
	},

	/**
	 desc: Switches to `disabled` state.
	 */
	disable: function(){
		this.$el.addClass(CLASSES.disabled);
		this.$select.prop('disabled', true);
	},

	/**
	 desc: Switches to `enabled` state.
	 */
	enable: function(){
		this.$el.removeClass(CLASSES.disabled);
		this.$select.prop('disabled', false);
	},

	/**
	 desc: Resets value to default.
	 */
	resetSelect: function(){
		this.$select.val(this.initVal);
		this._updateSelected();
	},

	/**
	 desc: Saves current value as a default. For future reset
	 */
	saveCurrentValue: function() {
		this.initVal = this.$select.val();
		this.$el.find('option').removeAttr('selected');
		this.$el.find('option[value=' + this.initVal + ']')
			.attr('selected', 'selected')
			.prop('selected', true);
	},

	/**
	 desc: Gets current value.
	 */
	getValue: function() {
		return this.$select.val();
	},

	/**
	 desc: Gets text of selected option.
	 */
	getCurrentText: function() {
		return this.getCurrentOption().text();
	},

	/**
	 desc: Gets text of selected option.
	 */
	getCurrentOption: function() {
		return this.$select.find(':selected');
	},

	/**
	 desc: Switches select to `loading` state. Returns Promise that allows to stop loading.
	 */
	activityIndicator: function() {
		var dfd = this.$tools.q.defer();

		this.$field.addClass(CLASSES.busy);
		this.$field.html(spinnerTemplate);

		dfd.finally(function() {
			this.$field.removeClass(CLASSES.busy);
			this._updateSelected();
		}.bind(this));

		return dfd.promise();
	},

	_onChange: function() {
		this._updateSelected();

		this.$events.trigger('change', this.$select.val());

		if (this.$options.submit) {
			this.$el.parents('form:first').submit();
		}

		if (this.$options.ajax) {
			var data = this.$el.data(),
				url = data.ajax;

			delete data.component;
			delete data.alias;
			delete data.group;
			delete data.ajax;

			data.value = this.$select.val();

			this.$tools.data.ajax({
				type: data ? 'POST' : 'GET',
				async: true,
				contentType: 'application/json',
				url: url,
				data: data ? JSON.stringify(data) : ''
			});
		}
	},

	_updateSelected: function() {
		this.$field.text(this.$select.find(':selected').text());
	},

	updateOptions: function(data) {
		this.$select.html('');
		if(data.length) {
			this.$select.html(data.map(function(item){return "<option value=\""+item.value+"\">"+item.label+"</option>";}).join(''));
		}
		this._updateSelected();
	},

	disableOption: function(value) {
		this.$tools.dom.find('option[value="'+value+'"]', this.$el).prop('disabled', true);
		this._updateSelected();
	},

	enableOption: function(value) {
		this.$tools.dom.find('option[value="'+value+'"]', this.$el).prop('disabled', false);
		this._updateSelected();
	},

	canChoose: function() {
		return this.$tools.dom.find('option:not(:disabled)').length !== 0;
	}
};
