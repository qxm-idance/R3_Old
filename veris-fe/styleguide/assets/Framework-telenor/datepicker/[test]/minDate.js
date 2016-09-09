var helper = require('./helpers/helper.js');
var defaultConfig = require('./config/default.js');
var config = Object.create(defaultConfig);

config.defaultDate = '13.06.2015';
config.minDate = '02.06.2015';

describe('Datepicker', function() {
	var dp;

	beforeEach(function() {
		helper.setUp(this, config);
		dp = this.dp;
	});

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('Min date', function() {
		beforeEach(function() {
			dp.openPopup();
		});

		it('should not set date less than minimal', function() {
			dp.popup.getDateElement('2015-06-01').click();

			expect(dp.hasPopup()).toBe(true);

			expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
			expect(dp.getValue()).toBe('13.06.2015');
		});

		it('should disable dates less than min date', function() {
			expect(dp.popup.getDateElement('2015-06-01')).toHaveTagName('span');
			expect(dp.popup.getDateElement('2015-06-02')).toHaveTagName('a');
		});

		it('should not have previous buttons', function() {
			expect(dp.popup.getFirstMonthHeader().find('a')).toHaveClass('datepick-disabled');
		});
	});
});
