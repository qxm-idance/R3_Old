var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);

config.defaultDate = '13.06.2015';
config.disabledDates = ['20150608', '20150618'];

describe('Datepicker', function() {
	var dp;

	beforeEach(function() {
		helper.setUp(this, config);
		dp = this.dp;
	});

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('single full configuration', function() {

		describe('popup', function() {
			beforeEach(function() {
				dp.openPopup();
			});

			it('should disable specific dates', function() {
				expect(dp.popup.getDateElement('2015-06-07')).toHaveTagName('a');
				expect(dp.popup.getDateElement('2015-06-08')).toHaveTagName('span');
				expect(dp.popup.getDateElement('2015-06-09')).toHaveTagName('a');
				expect(dp.popup.getDateElement('2015-06-17')).toHaveTagName('a');
				expect(dp.popup.getDateElement('2015-06-18')).toHaveTagName('span');
				expect(dp.popup.getDateElement('2015-06-19')).toHaveTagName('a');
			});

			it('should not set disabled date', function() {
				dp.popup.getDateElement('2015-06-08').click();

				expect(dp.hasPopup()).toBe(true);

				expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
				expect(dp.getValue()).toBe('13.06.2015');
			});
		});
	});
});
