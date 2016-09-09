/* 			HEY YOU IT REQUIRES YOUR ATTENTION!
	jQuery IS STILL USED HERE AND SHOULD BE REWORKED
						FROM HERE
					 ________________
					|				|
					|				|
					|				|
			________|				|_________
			\                                /
			 \                              /
			  \                            /
			   \                          /
			    \                        /
			     \                      /
			      \                    /
			       \                  /
			        \                /
			         \              /
			          \            /
			           \          /
			            \        /
			             \      /
			              \	   /
			               \  /
			                \/

/* TODO: Remove jQuery and reimplement methods */
/* When all methods will be reworked remove jquery dependency and rewrap helper */

var jq = require('jquery');

var jqueryValidation = require('jquery-validation');
var sticky = require('./jq-plugins/jquery.sticky.js');
var logger =  new (require('Common/aura/js/logger'))("Element", __DEBUG__);

/* <------- TO HERE */

module.exports = function(Element) {
	var proto = Element.prototype;
	var array = Array.prototype;

	/* tries to unwrap elements out of jquery and wrap into Element */
	function rewrap(value) {
		return value instanceof Element || value instanceof jq
					? new Element(value.get())
					: value;
	}

	/* returns stack trace */
	function getStack(){
		try {
			throw new Error();
		}
		catch(err) {
			return err.stack.split('\n').map(function(item){ return item.replace(/^\s+at\s/ig, ''); }).slice(4)
		}
	}

	/* DELEGATED jQuery METHODS */

	[
		'offset' 	,'data'  	,'find'		,'children' 	,'siblings'		,'filter',
		'is' 		,'index' 	,'detach' 	,'has' 		,'outerWidth' 	,'outerHeight' 	,'not',
		'after' , 'before','closest' 	,'css', 'next', 'prev','wrapInner', 'scrollTop', 'position', 'rules'

	].forEach(function(prop) {
		proto[prop] = function(){
			return rewrap(jq()[prop].apply(jq(this.slice()), arguments));
		}
	});

	/* DEPRECATED METHODS */
	[
		{
			message: 'Method "{m}" is deprecated Component.prototype.html should be used instead!',
			methods: ['prepend', 'append', 'empty', 'appendTo']
		},

		{
			message: 'Method "{m}" is deprecated Component.prototype.$events should be used instead!',
			methods: ['on', 'one', 'off', 'trigger', 'click', 'resize', 'focus']
		},

		{
			message: 'Method "{m}" is deprecated and will be deleted soon!',
			methods: ['sticky', 'slideDown', 'serializeArray', 'prop', 'replaceWith', 'prependTo', 'parents', 'remove',
				'validate', 'valid', 'slideUp', 'datepick', 'DataTable']
		}
	].forEach(function(item) {
		item.methods.forEach(function(prop){
			proto[prop] = function(){
				/* Print message for deprecated methods in Debug mode */
				logger.warn(item.message.replace('{m}', prop), {stack: getStack()});

				return rewrap(jq()[prop].apply(jq(this.slice()), arguments));
			}
		});
	});

	/* MISSING jQuery METHODS BUT USED SOMEWHERE IN CODE */
		/* Notify about missing method with Exception */

	Object.keys(jq.prototype).forEach(function(prop){
		var _value = undefined;

		if(proto[prop] === undefined) {
			Object.defineProperty(proto, prop, {
				enumerable: true,
				configurable: true,
				get: function(){
					if(_value === undefined) {
						logger.error('jQuery method "' + prop + '" has not been implemented in Framework::element!');
					}

					return _value;
				},
				set: function(v){
					_value = v;
				}
			});
		}
	});

	/* Utility methods what have not to be processed by notifier */
	['jquery', 'selector', 'promise', 'ready', 'load'].forEach(function(prop){
		if(proto.hasOwnProperty(prop)) {
			delete proto[prop];
		}
	});

	/* Static jquery delegating methods */

	Element.find = function() {
		return rewrap(jq.apply(jq, arguments));
	};

	Element.data = function() {
		var args = array.slice.call(arguments, 1);
		var el = arguments[0] instanceof (Node) ? [arguments[0]] : arguments[0];

		return proto.data.apply(el, args);
	};

	Element.validator = function() {
		return rewrap(jq.validator.apply(jq, arguments));
	};

	/* jQuery plugins static methods */

	Object.keys(jq.validator).forEach(function(method) {
		Element.validator[method] = function() {
			rewrap(jq.validator[method].apply(jq.validator, arguments));
		}
	});



};
