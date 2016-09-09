/**
name: Form
type: ui
desc: >
	Powers `<form />` element.
	Helps with form validation, enabling/disabling, submitting data.
options:
	preventSubmit: If `true` - prevents native form submitting.
	url: Specifies URL to interact with back-end.
	skipNamesTruncating: If set to `true`, method `serialize` will not remove first token of name (before the first dot) of input fields.
events:
	reset: Fires when native `reset` event was triggered.
	formReset: Fires when `reset` method clears all fields.
	submit: Fires when form is submitting and all fields are valid.
*/
module.exports = {
	events: {
		'submit': '_onSubmit',
		'reset': '_onReset'
	},

	/**
		desc: >
			Serializes form to key-value pair.
	
			Note! If control name contains dot, we should remove first token.
			Because .NET Razor mapper renders names with a token of ViewModel name,
			but MVC mapper for HTTP request parameters can't match them with model.
	*/
	serialize: function() {
		var obj = {};
		var	skipNamesTruncating = this.$options.skipNamesTruncating;
		var	serializedArray = this.$el.serializeArray();

		serializedArray.forEach(function(item) {
			if (!skipNamesTruncating) {
			item.name = item.name.replace(/^[^\.]+\./, '');
			}

			if (obj[item.name] !== undefined) {
				if (!obj[item.name].push) {
					obj[item.name] = [obj[item.name]];
				}

				obj[item.name].push(item.value || '');
			} else {
				obj[item.name] = item.value || '';
			}
		});

		return obj;
	},

	/**
		desc: Fills up HTML form controls with specified data.
		args:
			obj: Object. key-value object with form data.
	*/
	deserialize: function(obj) {
		Object.keys(obj).forEach(function(field) {
			var $el = this.$el.find('input').filter(function() {
				return this.getAttribute('name').toLowerCase().indexOf(field.toLowerCase()) != -1;
			});

			$el.val(obj[field]);
		}.bind(this))
	},

	/**
		desc: Enables all form controls.
	*/
	enable: function() {
		this.$el.find(':input').prop('disabled', false);
		if(this.$components.select && this.$components.select.length) {
			this.$components.select.forEach(function(select) {
				select.enable()
			});
		}
		return this;
	},

	/**
		desc: Disables all form controls.
	*/
	disable: function() {
		this.$el.find(':input').prop('disabled', true);
		if(this.$components.select && this.$components.select.length) {
			this.$components.select.forEach(function(select){
				select.disable()
			});
		}

		return this;
	},

	/**
		desc: Resets all form controls or only specified fields if aliases are set.
		args:
			aliases: Array<string>. Collection of aliases for inner components which should be cleared.
	*/
	reset: function(aliases) {
		if (aliases) {
			[].concat(aliases).forEach(function(alias) {
				alias = alias.trim();
				this.$components[alias] && this.$components[alias].$el.val('');
			}.bind(this));
		} else {
			this.$el.get(0).reset();
		}

		this.$events.trigger('formReset');
	},

	/**
		desc: >
			Validates a form using jQuery Unobtrusive Validation library.
			Returns `true` if form is valid, otherwise - `false`.
	*/
	valid: function() {
		if (this.$el.validate) {
			this.$el.validate();

			return this.$el.valid();
		}

		return true;
	},

	_onSubmit: function(event) {
		event.preventDefault();

		if (!this.valid()) {
			return;
		}

		this.$events.trigger('submit');

		if (!this._isSubmitPrevented()) {
			this._forceSubmit();
		}
	},

	_isSubmitPrevented: function() {
		if ('preventSubmit' in this.$options) {
			return this.$options.preventSubmit;
		}

		return true;
	},

	_onReset: function() {
		this.$events.trigger('reset');
	},

	/**
		desc: Gets form URL by `action` or `data-url` attributes to submit form data.
	*/
	getUrl: function() {
		return this.$el.prop('action') || this.$options.url;
	},

	_getMethod: function() {
		return (this.$el.prop('method') || 'post').toLowerCase();
	},

	/**
		desc: Submits native HTML form
	*/
	submit: function() {
		this.$el.submit();
	},

	_forceSubmit: function() {
		this.$el[0].submit();
	},

	/**
		desc: Submits form via ajax. returns a promise
	*/
	submitAsync: function() {
		var url = this.getUrl();
		var method = this._getMethod();
		var data = this.serialize();

		return this.$tools.data[method](url, data);
	},

	/**
		desc: Do form submittable on not basing on argument
		args:
			isSubmitPrevented: <boolean> If `true` - prevents native form submitting.
	*/
	preventSubmit: function(isSubmitPrevented) {
		this.$options.preventSubmit = isSubmitPrevented;
	}
};
