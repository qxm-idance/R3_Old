/**
name: Range slider
type: ui
desc: >
	Creates component for picking some data range.
options:
	from: set start value for min point
	to: set start value for max point
	single: if true - creates single slider for picking only one value. 
		Min point will be set as first value of min select.
	tooltip: set this property for each options inside selects to define tooltip text for each value.
		by default it will be just current value.
*/

module.exports = {
	ready: function() {
		this.$line = this.$el.find('.range-slider__points');

		this.from = this.$options.from ? this.$components.fromSelect.getIndex(this.$options.from) : 0;
		this.to = this.$options.to ?
			this.$components.toSelect.getIndex(this.$options.to) :
			this.$components.toSelect.getLength();

		this._setFrom(this.from);
		this._setTo(this.to);
	},

	events: {
		'move $from': '_moveFrom',
		'move $to': '_moveTo',
		'click .range-slider__line': '_containerClick',
		'change $fromSelect': '_fromSelectChanged',
		'change $toSelect': '_toSelectChanged'
	},

	_getTooltipText: function(value) {
		return this.$components.toSelect.getTooltip(value);
	},

	_getContainer: function() {
		return this.$el.find('.range-slider__container');
	},

	_moveFrom: function(e, x) {
		var container = this._getContainer();
		var containerX = container.offset().left;
		var width = container.width();
		var shift = x - containerX;
		var length;

		length = this.$components.fromSelect.getLength() - 1;

		this._setFrom(Math.round((shift * length) / width));
	},

	_moveTo: function(e, x) {
		var container = this._getContainer();
		var containerX = container.offset().left;
		var width = container.width();
		var shift = x - containerX;
		var length;

		length = this.$components.toSelect.getLength() - 1;

		this._setTo(Math.round((shift * length) / width));
	},

	_containerClick: function(e) {
		if (!this.$options.single) {
			return;
		}

		this._moveTo({}, e.pageX);
	},

	_prepareValue: function(value) {
		var max = this.$components.toSelect.getLength();

		if (value > max) {
			return max;
		}

		if (value < 0) {
			return 0;
		}

		return value;
	},
	/**
		desc: set value for "from" point
		args:
			value: set new Value
	*/
	setFrom: function(value) {
		this._setFrom(this.$components.fromSelect.getIndex(value));
	},

	_setFrom: function(value) {
		if (value >= this.to) {
			this._updateFromSelect();

			return;
		}

		value = this._prepareValue(value);

		this.from = value;

		this.$components.from.setTooltipText(this._getTooltipText(this.from));

		this._updateLineWidth();
		this._updateLinePosition();
		this._updateFromSelect();
		this._change();
	},

	/**
		desc: set value for "to" point
		args:
			value: set new Value
	*/
	setTo: function(value) {
		this._setTo(this.$components.toSelect.getIndex(value));
	},

	_setTo: function(value) {
		if (!this.$options.single && value <= this.from) {
			this._updateToSelect();

			return;
		}

		value = this._prepareValue(value);

		this.to = value;

		this.$components.to.setTooltipText(this._getTooltipText(this.to));

		this._updateLineWidth();
		this._updateToSelect();
		this._change();
	},

	_change: function() {
		this.$events.trigger('change', this.getRange());
	},

	_updateLineWidth: function() {
		var shift = this.to - this.from;
		var length = this.$components.toSelect.getLength() - 1;

		this.$line.width(((shift * 100) / length) + '%');
	},

	_updateFromSelect: function() {
		this.$components.fromSelect.setValue(this.from);
	},

	_updateToSelect: function() {
		this.$components.toSelect.setValue(this.to);
	},

	_updateLinePosition: function() {
		var length = this.$components.toSelect.getLength() - 1;

		this.$line.css('left', ((this.from * 100) / length) + '%');
	},

	/**
		desc: return current values of slider
	*/
	getRange: function() {
		return {
			from: this.$components.fromSelect.getValue(this.from),
			to: this.$components.toSelect.getValue(this.to)
		};
	},

	_fromSelectChanged: function() {
		this._setFrom(this.$components.fromSelect.value());
	},

	_toSelectChanged: function() {
		this._setTo(this.$components.toSelect.value());
	}
};
