var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);
var $ = require('jquery');

config.rangeSelect = true;
config.defaultDate = '13.06.2015';

describe('Datepicker', function() {
	var dp;

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('Range with default value', function() {
		beforeEach(function() {
			helper.setUp(this, config);
			dp = this.dp;
		});


		it('should have correct value', function() {
			expect(dp.getValue()).toBe('13.06.2015 - 13.06.2015', 'Default value is not set');

			dp.openPopup();

			expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
		});

		describe('Popup', function() {
			beforeEach(function() {
				dp.openPopup();
			});

			it('should set value on click', function() {
				dp.popup.getDateElement('2015-06-12').click();

				expect(dp.getValue()).toBe('12.06.2015 - 12.06.2015');
			});

			it('should insert range by clicking', function() {
				expect(dp.hasPopup()).toBe(true, 'Popup is not visible by default');


				expect(dp.popup.getDateElement('2015-06-13')).toExist('2015-06-13 does not exist.');
				dp.popup.getDateElement('2015-06-13').click();

				expect(dp.hasPopup()).toBe(true, 'Popup is not visible after first click');
				expect(dp.popup.getDateElement('2015-06-16')).toExist('2015-06-16 does not exist.');
				dp.popup.getDateElement('2015-06-16').click();

				// Required as datepicker opens new popup on second click
				dp.openPopup();

				expect($('.datepick-popup').length).toBe(1, 'Popup is not visible after second');
				expect(dp.popup.getSelectedDateElement().length).toBe(4);
				expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-14')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-15')).toHaveClass('datepick-selected');
				expect(dp.popup.getDateElement('2015-06-16')).toHaveClass('datepick-selected');
			});
		});
	});
});
