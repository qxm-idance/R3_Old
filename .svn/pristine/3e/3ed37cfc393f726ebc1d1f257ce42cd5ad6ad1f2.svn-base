var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);

config.defaultDate = '13.06.2015';
config.maxDate = '28.06.2015';

describe('Datepicker', function() {
	var dp;

	beforeEach(function() {
		helper.setUp(this, config);
		dp = this.dp;
	});

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('Max date', function() {
		beforeEach(function() {
			dp.openPopup();
		});

		it('should not set date greater than minimal', function() {
			dp.popup.getDateElement('2015-06-29').click();

			expect(dp.hasPopup()).toBe(true);

			expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
			expect(dp.getValue()).toBe('13.06.2015');
		});

		it('should disable dates greater than max date', function() {
			expect(dp.popup.getDateElement('2015-06-28')).toHaveTagName('a');
			expect(dp.popup.getDateElement('2015-06-29')).toHaveTagName('span');
		});

		it('should not have next buttons', function() {
			expect(dp.popup.getLastMonthHeader().find('a')).toHaveClass('datepick-disabled');
		});
	});
});
