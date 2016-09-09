var helper = require('./helpers/helper.js');

describe('Datepicker', function() {
	var dp;

	beforeEach(function() {
		helper.setUp(this);
		dp = this.dp;
	});

	afterEach(function() {
		helper.tearDown(this);
	});

	describe('basic input functionality', function() {
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

		it('should allow to insert date manually', function() {
			var selectedDate;

			dp.setValue('13.03.2015');
			dp.openPopup();

			selectedDate = dp.popup.getDateElement('2015-03-13');

			expect(selectedDate).toExist();
			expect(selectedDate).toHaveClass('datepick-selected');
		});
	});

	describe('basic popup functionality', function() {
		beforeEach(function() {
			dp.openPopup();
		});

		it('should not have selected date', function() {
			expect(dp.popup.getSelectedDateElement()).not.toExist();
		});

		//it('should mark date as selected on manual input', function() {
		//	dp.setValue('13.07.2015');
		//
		//	expect(dp.hasPopup()).toBe(true);
		//	expect(dp.popup.getSelectedDateElement()).toExist();
		//
		//	expect(dp.popup.getDateElement('2015-06-13')).toHaveClass('datepick-selected');
		//});

		it('should close with close button', function() {
			dp.popup.close();

			expect(dp.hasPopup()).toBe(false);
		});

		//it('should discard changes on close button click', function() {
		//	dp.setValue('13.06.2015');
		//	expect(dp.hasPopup()).toBe(true);
		//
		//	dp.popup.close();
		//
		//	expect(dp.getValue()).toBe('', 'Value was not cleared by cancel button');
		//});

		it('should close on selecting date', function() {
			dp.popup.getTodayElement().click();

			expect(dp.hasPopup()).toBe(false);
		});

		it('should have navigation links', function() {
			var prev = dp.popup.getPrevButton();
			var next = dp.popup.getNextButton();

			expect(prev).toExist();
			expect(prev).not.toHaveClass('datepick-disabled');

			expect(next).toExist();
			expect(next).not.toHaveClass('datepick-disabled');
		});
		
		it('should navigate to current date', function() {
			var todayLink;

			dp.popup.getNextButton().click();
			dp.popup.getNextButton().click();

			expect(dp.popup.getTodayElement()).not.toExist('Today element is visible');

			todayLink = dp.popup.$el.find('.datepick-cmd-today');
			expect(todayLink).toExist('There is no today link');
			todayLink.click();

			expect(dp.popup.getTodayElement()).toExist('Today element is NOT VISIBLE after today click');
		});
	});
});
