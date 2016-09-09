var selectorsHelper = require('../../../Tests/helpers/selectors');

var $ = require('jquery');

var selectors;
var SELECTORS = {
	fromPoint: '.range-slider__point--from',
	toPoint: '.range-slider__point--to',
	container: '.range-slider__container',
	fromSelect: '.test-select-from',
	toSelect: '.test-select-to',
	fromTooltip: function() {
		return $('.tooltip--from p');
	},
	toTooltip: function() {
		return $('.tooltip--to p');
	}
};

var defaultTemplate = require('./templates/default.html');

var componentName = 'range-slider';

describe('Range slider', function() {
	describe('from pointer', function() {
		beforeEach(function() {
			helpers.aura.setUp(this, defaultTemplate, componentName);

			selectors = selectorsHelper.generate(SELECTORS, this.component);
		});

		afterEach(function() {
			helpers.aura.tearDown(this);

			$('.tooltip').remove();
		});

		it('should move slider to next value if mouse moved under half of next step', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left + (container.width() / 8 + 15);

			expect(selectors.getFromPoint().offset().left).toEqual(container.width() / 4 - 11 + container.offset().left);

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromPoint().offset().left).toEqual((2 * container.width() / 4) - 11 + container.offset().left);
		});

		it('should change from select inside when move to next value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left + (container.width() / 8 + 15);

			expect(selectors.getFromSelect().val()).toEqual('10');

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromSelect().val()).toEqual('20');
		});

		it('should update tooltip', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left + (container.width() / 8 + 15);

			expect(selectors.getFromTooltip()).toHaveText('10 kr.');

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromTooltip()).toHaveText('20 kr.');
		});

		it('should move slider to previous value if mouse moved under half of previous step', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left - (container.width() / 8);

			expect(selectors.getFromPoint().offset().left).toEqual(container.width() / 4 - 11 + container.offset().left);

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromPoint().offset().left).toEqual(container.offset().left - 11);
		});

		it('should change from select inside when move to previous value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left - (container.width() / 8);

			expect(selectors.getFromSelect().val()).toEqual('10');

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromSelect().val()).toEqual('0');
		});

		it('should not set value bigger than "to" value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left + (container.width() / 2 + 15);

			expect(selectors.getFromPoint().offset().left).toEqual(container.width() / 4 - 11 + container.offset().left);

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromPoint().offset().left).toEqual(container.width() / 4 - 11 + container.offset().left);
		});

		it('should not update select after tring of set value bigger than "to" value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getFromPoint().offset().left + (container.width() / 2 + 15);

			expect(selectors.getFromSelect().val()).toEqual('10');

			selectors.getFromPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getFromSelect().val()).toEqual('10');
		});
	});

	describe('to pointer', function() {
		beforeEach(function() {
			helpers.aura.setUp(this, defaultTemplate, componentName);

			selectors = selectorsHelper.generate(SELECTORS, this.component);
		});

		afterEach(function() {
			helpers.aura.tearDown(this);
			$('.tooltip').remove();
		});

		it('should move slider to next value if mouse moved under half of next step', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left + (container.width() / 8 + 25);

			expect(selectors.getToPoint().offset().left).toEqual(3 * container.width() / 4 - 9 + container.offset().left);

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToPoint().offset().left).toEqual(container.width() - 9 + container.offset().left);
		});

		it('should change from select inside when move to next value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left + (container.width() / 8 + 25);

			expect(selectors.getToSelect().val()).toEqual('30');

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToSelect().val()).toEqual('40');
		});

		it('should update tooltip', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left + (container.width() / 8 + 25);

			expect(selectors.getToTooltip()).toHaveText('30 kr.');

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToTooltip()).toHaveText('40 kr.');
		});

		it('should move slider to previous value if mouse moved under half of previous step', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left - (container.width() / 8);

			expect(selectors.getToPoint().offset().left).toEqual(3 * container.width() / 4 - 9 + container.offset().left);

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToPoint().offset().left).toEqual(container.width() / 2 - 9 + container.offset().left);
		});

		it('should change from select inside when move to previous value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left - (container.width() / 8);

			expect(selectors.getToSelect().val()).toEqual('30');

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToSelect().val()).toEqual('20');
		});

		it('should not set value less than "from" value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left - (container.width() / 2 + 25);

			expect(selectors.getToPoint().offset().left).toEqual(3 * container.width() / 4 - 9 + container.offset().left);

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToPoint().offset().left).toEqual(3 * container.width() / 4 - 9 + container.offset().left);
		});

		it('should not update select after tring of set value less than "from" value', function() {
			var container = selectors.getContainer();
			var mouseMoveEvent = $.Event('mousemove');

			mouseMoveEvent.pageX = selectors.getToPoint().offset().left + (container.width() / 2 + 25);

			expect(selectors.getToSelect().val()).toEqual('30');

			selectors.getToPoint().mousedown();

			$('body').trigger(mouseMoveEvent);

			expect(selectors.getToSelect().val()).toEqual('30');
		});
	});
});