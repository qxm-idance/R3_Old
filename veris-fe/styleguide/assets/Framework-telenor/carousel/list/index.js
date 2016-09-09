var DEFAULT_OPTIONS = {
	duration: 700,
	slideElement: 1,
	visibleSlides: 4,
	minSlidesNumber: 6,
	perspectives: ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']
};
/**
name: Carousel list
type: ui
desc: >
    Rotates slides.
options:
    duration: Duration in milliseconds for slide changing. Default value is 700 milliseconds.
    slideElement: Integer. Quantity of items which move during one step of animation. Default value is 1.
    visibleSlides: Integer. Quantity visible slides. Default value is 4.
    minSlidesNumber: Integer. Quantity slides for activate carousel list. Default value is 6.
events: 
		changeSlide: Object. Current carousel list state.
 */
module.exports = {
	initialize: function() {
		this.options = this.$tools.util.extend({}, DEFAULT_OPTIONS, this.$options);
		this._activated = false;
	},
	/**
	desc: >
		Recalculate carousel list properties (itemWidth, current slide index, finish slide index, css prefix and css animation).
		Resets carousel list styles.
		Set new carousel list styles.
		Will not activate carousel list, if slides quantity less then `minSlidesNumber`.
	args:
		parentWidth: Integer. Wrapper width.
		current: Integer. Current slide index. Can be omitted. Default value is 0;
	 */
	activate: function(parentWidth, current) {
		this._activated = (this.$elements.carouselItems.length >= this.options.minSlidesNumber);

		if (!this._activated) return;

		this.itemWidth  = (parentWidth / this.options.visibleSlides);
		this.current = current || 0;
		this.finish = Math.max(this.$elements.carouselItems.length - this.options.visibleSlides, 0);

		this.cssPrefix = this._getCssPrefix(this.options.perspectives);
		this.cssAnimation = '-' + this.cssPrefix + '-transform';

		this.$el.removeAttr('style');
		this.$elements.carouselItems.removeAttr('style');


		this.$elements.carouselItems.forEach(function(item) {
			item.style.width = this.itemWidth + 'px';
		}.bind(this));

		this.$el.css('width', this.$elements.carouselItems.length * this.itemWidth);
	},
	_getCssPrefix: function(perspectives) {
		var cssPrefix = '';
		var i;

		for(i in perspectives) {
			if(this.$el[0].style[perspectives[i]] !== undefined) {
				cssPrefix = perspectives[i].replace('Perspective', '').toLowerCase();
				break;
			}
		}

		return cssPrefix;
	},
	_getLeft: function(current) {
		return this.itemWidth * current;
	},
	/**
	desc: Removes carousel styles.
	 */
	deactivate: function() {
		this._activated = false;
		this.$el.removeAttr('style');
		this.$elements.carouselItems.removeAttr('style');
	},
	/**
	desc: Shows next slide.
	 */
	nextStep: function() {
		var current = this.current = Math.min(this.current + this.options.slideElement, (this.$elements.carouselItems.length - 1));
		requestAnimationFrame(this._scrollElement.bind(this, this._getLeft(current)));
	},
	/**
	desc: Shows previous slide.
	 */
	prevStep: function() {
		var current = this.current = Math.max(this.current - this.options.slideElement, 0);
		requestAnimationFrame(this._scrollElement.bind(this, this._getLeft(current)));
	},
	_scrollElement: function(position) {
		var value = -position;

		this.$el.css('-' + this.cssPrefix + '-transition-duration', this.options.duration / 1000 + 's');
		this.$el.css(this.cssAnimation, 'translate3d(' + value + 'px, 0, 0)');

		this.$events.trigger('changeSlide', this.getState());
	},
	/**
	desc: Returns carousel state.
	 */
	getState: function() {
		return {
			current: this.current,
			finish: this.finish,
			activated: this._activated
		};
	}
};
