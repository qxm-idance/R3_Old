var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);

config.defaultDate = '13.06.2015';

describe('Datepicker', function() {
	var dp;

	beforeEach(function() {
		helper.setUp(this, config);
		dp = this.dp;
	});

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('input functionality with default date', function() {
		it('should have value by default', function() {
			expect(dp.getValue()).toBe('13.06.2015');
			expect(dp.hasPopup()).toBe(false);
		});
	});

	describe('popup functionality with default date', function() {
		beforeEach(function() {
			dp.openPopup();
		});

		it('should select correct date', function() {
			expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
		});

		it('should select date on click', function() {
			dp.popup.getDateElement('2015-06-14').click();

			expect(dp.getValue()).toBe('14.06.2015');

			dp.openPopup();

			expect(dp.popup.getDateElement('2015-06-14')).toHaveClass('datepick-selected');
		});

		it('should move to prev month on prev click', function() {
			expect(dp.popup.getFirstMonthHeader()).toHaveText('June 2015');

			dp.popup.getPrevButton().click();

			expect(dp.popup.getFirstMonthHeader()).toHaveText('May 2015');
		});

		it('should move to next month on next click', function() {
			expect(dp.popup.getLastMonthHeader()).toHaveText('July 2015');

			dp.popup.getNextButton().click();

			expect(dp.popup.getLastMonthHeader()).toHaveText('August 2015');
		});
	});
});
