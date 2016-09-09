module.exports = {
    events: {
        'click button.speech-bubble__close': 'close'
    },

    initialize: function() {
        // move bubble to the root level to prevent wrong positioning with relatively positioned container
        this.$tools.dom.find('body').append(this.$el);

        this.isOpen = true;
        this.format = false;

        this.clickedToggleClass = 'toggle--clicked';

        this.$closeButton = this.$el.find('button.speech-bubble__close');

        this.$toggleButton = this._getToggleButton();
        this.$toggleButton.on('click', this.onToggleBubble.bind(this));
        this.$toggleButton.on('focusin', this.onFocusIn.bind(this));
        this.$toggleButton.on('focusout', this.onFocusOut.bind(this));

        this.win = this.$tools.dom.find(window);
        this.win.on('load resize orientationchange', this._checkState.bind(this));

        this.$tools.data.pubsub.subscribe('speech.bubble.open', this._onOpen.bind(this));
        this.$tools.data.pubsub.subscribe('speech.bubble.close', this._onClose.bind(this));

        this.close();

        this.$tools.dom.find(window).on('scroll', this._adjustPosition.bind(this));
    },
    ready: function() {
        this.$el.addClass('is-loaded');
    },
    onToggleBubble: function(e) {
        if (this.isOpen) {
            this.close();
            clearTimeout(this.focusOpenDelay);
        } else {
            if (e && e.currentTarget) {
                var $toggle = this.$tools.dom.find(e.currentTarget);
                $toggle.addClass(this.clickedToggleClass);
                e.preventDefault();
            }

            setTimeout(this.open.bind(this), 0);
        }
    },
    onFocusIn: function(e) {
        this.toggleInFocus = true;

        this.focusOpenDelay = setTimeout((function() {
            if (!this.isOpen) {
                setTimeout(this.open.bind(this), 0);
            }
        }).bind(this), 150);
    },
    onFocusOut: function(e) {},
    onGlobalClick: function(e) {
        if (!this.isOpen ||
            this.$tools.dom.find(e.target).closest('.speech-bubble').length ||
            this.$toggleButton.find(e.target).length) {
            return;
        }

        this.close();
    },
    open: function() {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;

        this._adjustPosition();

        this.$el.addClass('is-open');
        this.$toggleButton.addClass('is-active');

        this.$tools.dom.find('body').on('click', this.onGlobalClick.bind(this));

        this.$events.trigger('open');
    },
    close: function() {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;

        this.$el.removeClass('is-open');
        this.$toggleButton.removeClass(this.clickedToggleClass);
        this.$toggleButton.removeClass('is-active').trigger('blur');

        this.$tools.dom.find('body').off('click');

        this.$events.trigger('close');
    },
    setFormat: function(format) {
        this.format = format;

        this._adjustPosition();
    },
    _getToggleButton: function() {
        // search toggle button by specified JQuery selector
        var $toggle = this.$tools.dom.find(this.$options.toggleTarget);
        if (!$toggle.length) {
            // if not found - try to find by ID
            $toggle = this.$tools.dom.find('#' + this.$options.toggleTarget);
        }
        return $toggle;
    },
    _checkState: function() {
        if (this.isOpen) {
            this._adjustPosition();
        }
    },
    _adjustPosition: function() {
        var $toggle = this.$toggleButton;
        if ($toggle.length > 1) {
            $toggle = $toggle.filter('.' + this.clickedToggleClass);
        }

        if (this.format) {
            this.$el.css({
                top: $toggle.outerHeight() + $toggle.position().top + 4 + this.format.top,
                left: $toggle.position().left + this.format.left,
                width: this.format.width,
                height: this.format.height
            });
        } else {
            var xPosition = $toggle.offset().left,
                yPosition = $toggle.outerHeight() + $toggle.offset().top + 4,
                winWidth = this.win.width();

            this.$el.css({top: yPosition});

            // check horizontal fit
            if (xPosition + this.$el.outerWidth() > winWidth || this.$options.position === 'right') {
                xPosition = winWidth - $toggle.outerWidth() - xPosition;
                this.$el.css({
                    left: 'auto',
                    right: xPosition
                }).addClass('reverce');

            } else {
                this.$el.css({
                    left: xPosition,
                    right: 'auto'
                }).removeClass('reverce');
            }
        }
    },
    _onOpen: function(event, bubbleToOpen) {
        if (bubbleToOpen && bubbleToOpen === this.$options.toggleTarget) {
            this.open();
        }
    },
    _onClose: function(event, bubbleToOpen) {
        if (bubbleToOpen && bubbleToOpen === this.$options.toggleTarget) {
            this.close();
        }
    }
};
