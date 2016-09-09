/**
name: Carousel
type: ui
desc: >
    Implementation of component for carousel.
 */
module.exports = {
	events: {
		'click $next': '_nextStep',
		'click $prev': '_prevStep',
		'changeSlide $list': '_onChangeSlide'
	},
	initialize: function() {
		this._activated = false;
	},
	/**
	 desc: >
		 Shows carousel controls.
		 Activates carousel list.
		 Updates controls state.
		 Doesn't do anything if carousel will be hidden.
	 */
	activate: function() {
		if (!this.$el.width()) return;

		this._toggleControls(true);
		this.$components.list.activate(this.$elements.carouselWrapper[0].offsetWidth);
		this._updateControlsState(this.$components.list.getState());
		this._activated = true;
	},
	/**
	 desc: >
		 Hides carousel controls.
		 Deactivates carousel list.
	 */
	deactivate: function() {
		this._toggleControls(false);
		this.$components.list.deactivate();
		this._activated = false;
	},
	/**
	 desc: Returns `true` if carousel is activated, otherwise - `false`.
	 */
	isActive: function() {
		return this._activated;
	},
	_toggleControls: function(isVisible) {
		this.$components.prev.toggle(isVisible);
		this.$components.next.toggle(isVisible);
	},
	_onChangeSlide: function(e, state) {
		this._updateControlsState(state);
	},
	_updateControlsState: function(state) {
		this.$components.prev.enable();
		this.$components.next.enable();
		if (!state.activated) {
			this.deactivate();
		} else if (state.current === 0) {
			this._noPrevious()
		} else if (state.current === state.finish) {
			this._noNext();
		}
	},
	_noPrevious: function() {
		this.$components.prev.disable();
	},
	_noNext: function() {
		this.$components.next.disable();
	},
	_nextStep: function() {
		this.$components.list.nextStep();
	},
	_prevStep: function() {
		this.$components.list.prevStep();
	}
};


