var $ = require('jquery');
var baseMessage = require('../index.js');
var animateHelper = require('../../../Tests/helpers/animate-mock');

describe('Message', function() {
	var message;

	beforeEach(function() {
		animateHelper.mock();

		jasmine.clock().install();

		message = Object.create(baseMessage);

		message.$events = {
			trigger: jasmine.createSpy('$events.trigger')
		};

		message.$tools = {
			data: {
				get: jasmine.createSpy('data.get')
			}
		};

		message.$el = $(
			'<div id="default-message" class="message message--alert" data-component="message">' +
			'<div class="message__inner" data-element="messageContent">' +
			'<span class="message__icon icon icon-notification"></span>' +

			'<div class="text--small message__text">' +
			'<p data-element="messageText">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>' +
			'</div>' +

			'<button class="message__close" data-component="element" data-alias="messageClose"><span class="icon-remove"></span></button>' +
			'</div>' +
			'</div>'
		);

		message.$options = {};
	});

	afterEach(function() {
		jasmine.clock().uninstall();
	});

	describe('initialize', function() {
		beforeEach(function() {
			message.$el.appendTo(document.body);
		});

		afterEach(function() {
			message.$el.remove();
		});

		it('should add click handler', function() {
			message.$el.removeClass('is-hidden');

			message.initialize();
			message.$el.find('button.message__close').click();

			expect(message.$el).toHaveClass('is-closing');

			jasmine.clock().tick(220);

			expect(message.$events.trigger).toHaveBeenCalledWith('close');
			expect(message.$el).not.toHaveClass('is-closing');
			expect(message.$el).toHaveClass('is-hidden');
		});
	});

	describe('ready', function() {
		it('should run close animation if autoclose is set', function() {
			message.$options.autoclose = true;
			message.$el.removeClass('is-hidden');

			message.ready();

			jasmine.clock().tick(450);

			expect(message.$events.trigger.calls.count()).toBe(1, '');
			expect(message.$events.trigger.calls.argsFor(0)[0]).toBe('close');
			expect(message.$el).toHaveClass('is-hidden');
		});

		it('should call close after delay', function() {
			message.$el.appendTo(document.body);

			message.$options.autoclose = true;
			message.$options.hidden = true;
			message.$el.removeClass('is-hidden');

			message.ready();

			expect(message.$el).not.toHaveClass('is-closing');

			jasmine.clock().tick(220);

			expect(message.$el).toHaveClass('is-closing');
			expect(message.$el).not.toHaveClass('is-hidden');
		});
	});

	describe('setText', function() {
		it('should set text on text container', function() {
			message.setText('qwerty');

			expect(message.$el.find('.message__text p').text()).toBe('qwerty');
		});
	});

	describe('setType', function() {
		it('should set expected classes', function() {
			message.setType('error');

			expect(message.$el).not.toHaveClass('message--alert');
			expect(message.$el).toHaveClass('message--error');
		});
	});

	describe('open', function() {
		it('should slide down element', function() {
			message.open();

			expect(message.$events.trigger).not.toHaveBeenCalled();

			jasmine.clock().tick(220);

			expect(message.$el).not.toHaveClass('is-hidden');
			expect(message.$events.trigger).toHaveBeenCalledWith('open');
		});
	});

	describe('close', function() {
		beforeEach(function() {
			message.$el.appendTo(document.body);
		});

		it('should set expected class on the element after delay', function() {
			message.$el.removeClass('is-hidden');

			message.close();

			expect(message.$el).toHaveClass('is-closing');
			expect(message.$events.trigger).not.toHaveBeenCalled();

			jasmine.clock().tick(220);

			expect(message.$el).not.toHaveClass('is-closing');
			expect(message.$el).toHaveClass('is-hidden');
			expect(message.$tools.data.get).not.toHaveBeenCalled();
			expect(message.$events.trigger).toHaveBeenCalledWith('close');
		});

		it('should send request to closeAction url', function() {
			message.$options.closeAction = 'qwerty';

			message.close();

			expect(message.$tools.data.get).toHaveBeenCalledWith('qwerty');
		});
	});

	describe('onOpened', function() {
		it('should remove hidden class and trigger event', function() {
			message.onOpened();

			expect(message.$el).not.toHaveClass('is-hidden');
			expect(message.$events.trigger).toHaveBeenCalledWith('open');
		});
	});

	describe('onClosed', function() {
		it('should set correct classes on the element and trigger "close" event', function() {
			message.$el.addClass('is-closing');
			message.$el.removeClass('is-hidden');

			message.onClosed();

			expect(message.$el).not.toHaveClass('is-closing');
			expect(message.$el).toHaveClass('is-hidden');
			expect(message.$events.trigger).toHaveBeenCalledWith('close');
		});
	});

	describe('onClick', function() {
		beforeEach(function() {
			message.close = jasmine.createSpy('message.close');
		});

		it('should call close and return false', function() {
			var returnValue = message.onClick();

			expect(returnValue).toBe(false);
			expect(message.close).toHaveBeenCalled();
		});
	});

	describe('Type helpers', function() {
		it('should set text and type for error', function() {
			message.error('qwerty');

			expect(message.$el).toHaveClass('message--error');
			expect(message.$el.find('.message__text p').text()).toBe('qwerty');
		});

		it('should set text and type for alert', function() {
			message.alert('qwerty');

			expect(message.$el).toHaveClass('message--alert');
			expect(message.$el.find('.message__text p').text()).toBe('qwerty');
		});

		it('should set text and type for warning', function() {
			message.warning('qwerty');

			expect(message.$el).toHaveClass('message--warning');
			expect(message.$el.find('.message__text p').text()).toBe('qwerty');
		});
	});

});