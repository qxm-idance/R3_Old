var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);

config.rangeSelect = true;

describe('Datepicker', function() {
	var dp;

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('Range with no date', function() {
		beforeEach(function() {
			helper.setUp(this, config);
			dp = this.dp;
		});

		describe('input functionality', function() {
			it('should have empty value', function() {
				expect(dp.getValue()).toBe('', 'Input is not empty');
			});

			it('should not show popup', function() {
				expect(dp.hasPopup()).toBe(false, 'Popup is visible by default');
			});

			it('should open popup on click', function() {
				dp.openPopup();

				expect(dp.hasPopup()).toBe(true, 'Popup is not visible after click');
			});

			it('should not have selected date', function() {
				dp.openPopup();

				expect(dp.popup.getSelectedDateElement()).not.toExist();
			});

			it('should allow to insert single date manually', function() {
				dp.setValue('12.03.2015');
				dp.openPopup();

				expect(dp.popup.getDateElement('2015-03-12')).toHaveClass('datepick-selected');
			});


			it('should allow to insert date range manually', function() {
				dp.setValue('13.06.2015 - 16.06.2015');
				dp.openPopup();

				expect(dp.popup.getSelectedDateElement().length).toBe(4);
				expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-14')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-15')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-16')).toHaveClass('datepick-selected');
			});

			it('should have apply button', function() {
				dp.openPopup();

				expect(dp.popup.getApplyButton()).toExist();
				expect(dp.popup.getApplyButton()).toHaveText('Apply');
			});
		});
	});
});
