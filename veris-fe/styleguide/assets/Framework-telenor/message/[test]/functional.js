var animateHelper = require('../../../Tests/helpers/animate-mock');

describe('Message functional', function() {
	beforeEach(function() {
		jasmine.clock().install();
		animateHelper.mock();
	});

	afterEach(function() {
		jasmine.clock().uninstall();
		helpers.aura.tearDown(this);
	});

	describe('default', function() {
		var template = require('./default.html');

		beforeEach(function() {
			helpers.aura.setUp(this, template, 'message');
		});

		it('should hide on close click', function() {
			this.component.$el.find('button.message__close').click();

			expect(this.component.$el).toHaveClass('is-closing');

			jasmine.clock().tick(220);

			expect(this.component.$el).not.toHaveClass('is-closing');
			expect(this.component.$el).toHaveClass('is-hidden');
		});
	});

	describe('hidden', function() {
		var template = require('./hidden.html');

		beforeEach(function() {
			helpers.aura.setUp(this, template, 'message');
		});

		it('should be hidden by default', function() {
			expect(this.component.$el).toHaveClass('is-hidden');
		});
	});

	describe('autoclose', function() {
		var template = require('./autoclose.html');

		beforeEach(function() {
			helpers.aura.setUp(this, template, 'message');
		});

		it('should hide message after timeout', function() {
			jasmine.clock().tick(220);
			expect(this.component.$el).toHaveClass('is-closing');

			jasmine.clock().tick(200);
			expect(this.component.$el).not.toHaveClass('is-closing');
			expect(this.component.$el).toHaveClass('is-hidden');
		});
	});

	describe('closeAction', function() {
		var template = require('./close-action.html');

		beforeEach(function() {
			helpers.aura.setUp(this, template, 'message');
		});

		it('should send request on close', function() {
			spyOn(this.component.$tools.data, 'get');
			this.component.$el.find('button.message__close').click();

			jasmine.clock().tick(220);
			expect(this.component.$tools.data.get).toHaveBeenCalled();
			expect(this.component.$tools.data.get.calls.argsFor(0)[0]).toBe('/api/message');
		});
	});
});
