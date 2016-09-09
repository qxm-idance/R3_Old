function NumberBlock(component) {
  var input = component.$el.find('input');
  var increaseButton = component.$el.find('.number__control--increase');
  var decreaseButton = component.$el.find('.number__control--decrease');

  this.getValue = function() {
    return input.val();
  };

  this.increase = function() {
    increaseButton.click();
  };

  this.decrease = function() {
    decreaseButton.click();
  };
}

describe('Number', function() {
  afterEach(function() {
    helpers.aura.tearDown(this);
  });

  describe('default', function() {
    var template = require('./default.html');

    beforeEach(function() {
      helpers.aura.setUp(this, template, 'number');

      this.pageObject = new NumberBlock(this.component);
    });

    it('should get value', function() {
      expect(this.component.val()).toBe('3');
    });

    it('should set value', function() {
      this.component.val(10);

      expect(this.pageObject.getValue()).toBe('10');
    });

    it('should contain default controls', function() {
      expect(this.component.$el.find('.number__control--increase').length).toBe(1);
      expect(this.component.$el.find('.number__control--decrease').length).toBe(1);
    });

    it('should handle increase button clicks', function() {
      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('4');

      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('5');
    });

    it('should handle decrease button clicks', function() {
      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('2');

      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('1');
    });

    it('should not have max', function() {
      this.component.val(10);
      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('11');
    });

    it('should not decrease under min', function() {
      this.component.val(0);
      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('-1');
    });
  });

  describe('Min and max', function() {
    var template = require('./min-max.html');

    beforeEach(function() {
      helpers.aura.setUp(this, template, 'number');

      this.pageObject = new NumberBlock(this.component);
    });

    it('should get value', function() {
      expect(this.component.val()).toBe('3');
    });

    it('should limit max', function() {
      this.component.val(10);
      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('10');
    });

    it('should limit min', function() {
      this.component.val(0);
      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('0');
    });
  });

  describe('Custom step', function() {
    var template = require('./custom-step.html');

    beforeEach(function() {
      helpers.aura.setUp(this, template, 'number');

      this.pageObject = new NumberBlock(this.component);
    });

    it('should get value', function() {
      expect(this.component.val()).toBe('3');
    });

    it('should increase value on selected step', function() {
      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('5');
    });

    it('should decrease value on selected step', function() {
      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('1');
    });

    it('should set max value when increasing over', function() {
      this.component.val(9);
      this.pageObject.increase();

      expect(this.pageObject.getValue()).toBe('10');
    });

    it('should set min value when decreasing under', function() {
      this.component.val(1);
      this.pageObject.decrease();

      expect(this.pageObject.getValue()).toBe('0');
    });
  });
});
