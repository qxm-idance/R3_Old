/* Core class for the AuraElement. Contains public methods for DOM manipulation */
var CLASSES = {
	hidden: 'js-hidden'
};

var array = Array.prototype;
var proto = [];

function Element(els) {
	array.push.apply(this, array.concat(els || []));
}

proto.constructor = Element;
Element.prototype = proto;

/* Public methods */

proto.eq = function(index) {
	return new Element(this.get(index));
};

proto.get = function(index) {
	return isFinite(index) ? this.slice(index, index == -1 ? undefined : index + 1).pop() : this.slice();
};

proto.parent = function(selector) {
	var hasArgs = Boolean(arguments.length);

	return this.map(function(){
		var retval = this.parentNode;

		if (hasArgs) {
			retval = this.parentNode.matches(selector) ? this.parentNode : [];
		}
		return retval || [];
	});
};

proto.toArray = function() {
	return this.get();
};

proto.map = function(mapper) {
	return new Element(array.reduce.call(this, function(result, item){
		var mapped = mapper.call(item, array.slice.call(arguments, 1));
		var connector = mapped instanceof Array ? 'apply' : 'call';

		return array.concat[connector](result, mapped);
	}, []));
};

proto.add = function(items){
	var result = array.concat(this.get(), array.concat.apply([], items));
	
	return new Element(result.sort(function(a, b) {
		if(typeof a.compareDocumentPosition !== 'function') {
			return 0;
		}

		return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? 1 : -1;
	}));
};

proto.each = function(mapper) {
	array.forEach.call(this, function(item, index){
		return mapper.call(item, index, item);
	});

	return this;
};

proto.addClass = function(className) {
	return this.toggleClass(className, true);
};

proto.removeClass = function(className) {
	return this.toggleClass(className, false);
};

proto.toggleClass = function(className, condition) {
	var classes = className.split(' ').filter(Boolean);
	var methods = {
		true: 'add',
		false: 'remove'
	};

	var method = methods[condition] || 'toggle';

	this.forEach(function(item) {
		classes.forEach(function(cls) {
			item.classList[method](cls);
		});
	});

	return this;
};

proto.hasClass = function(className) {
	return this.some(function(item) {
		return item.classList.contains(className);
	});
};

proto.show = function() {
	return this.toggle(true);
};

proto.hide = function() {
	return this.toggle(false);
};

proto.toggle = function(condition) {
	if (arguments.length) {
		return this.toggleClass(CLASSES.hidden, !condition);
	}

	return this.toggleClass(CLASSES.hidden);
};

proto.attr = function(attr, value) {
	if(isNil(value)) {
		return this[0] && this[0].getAttribute && this[0].getAttribute(attr);
	}

	return this.each(function(index, item) {
		item.setAttribute && item.setAttribute(attr, value.toString());
	});
};

proto.prop = function(prop, value) {
	if(arguments.length === 1) {
		return this[0] && this[0][prop];
	}

	this.each(function(index, item) {
		item[prop] = value;
	});
};

proto.removeAttr = function(attr) {
	return this.each(function(index, item) {
		item.removeAttribute && item.removeAttribute(attr);
	});
};

proto.first = function() {
	return this.eq(0);
};

proto.last = function() {
	return this.eq(-1);
};

proto.val = function(value) {
	if (isNil(value)) {
		return this[0] && this[0].value;
	}

	this.each(function(index, item) {
		item.value = value.toString();
	});

	return this.attr('value', value);
};

proto.text = function(text) {
	if(isNil(text)) {
		return this[0] && this[0].textContent;
	}

	return this.each(function(index, item) {
		item.textContent = text.toString();
	});
};

proto.width = function(value) {
	if (isNil(value)) {
		return this[0] && this[0].offsetWidth;
	}

	return this.each(function(index, item) {
		if (typeof value === "number") {
			item.style.width = value + "px";
		} else {
			item.style.width = value;
		}
	});
};

proto.height = function(value) {
	if (isNil(value)) {
		return this[0] && this[0].offsetHeight;
	}

	return this.each(function(index, item) {
		if (typeof value === "number") {
			item.style.height = value + "px";
		} else {
			item.style.height = value;
		}
	});
};

/**
	desc: Fires submit event. If event went up to the body and wasn't prevented call native form submit
*/
proto.submit = function() {
	return this.each(function(index, item) {
		var event;
		
		if (item.tagName !== 'FORM') {
			return;
		}

		event = new CustomEvent('submit', {
			cancelable: true
		});
		
		item.dispatchEvent(event);
	});
};

/**
	desc: Sets or returns HTML of the first element in collection
	args: html: String. Set of HTML elements represented as string
*/
proto.html = function() {
	if (arguments.length === 0) {
		return this.get(0).innerHTML;
	} else {
		this.get(0).innerHTML = arguments[0];
	}
};

/**
	desc: clones DOM elements
	args: deep: Boolean. Boolean flag for deep cloning. Defautl value is 'true'
*/
proto.clone = function(deep) {
	return this.map(function() {
		var clone = this.cloneNode(!(deep === false));

		clone._origin = this;
		
		return clone;
	});
}

/**
	desc: If cloned items are in collection, it will return origin nodes for such items
*/
proto.origin = function() {
	return this.map(function() {
		return this._origin || [];
	});
}

/**
	desc: Returns collection of filtered elements(wrapped Array.filter. Can't use "filter" name due to large amount of jQuery style filter usages)
	args: filterer: Function. filtering function
*/
proto.sift = function(filterer) {
	return new Element(this.get().filter(function(item) {
		return filterer(new Element(item));
	}));
}

/* Static methods */

/* Private methods */

function isNil(value) {
	return value === undefined || value === null || value !== value;
}

require('./jqWrapper')(Element);

/* returns new Element instantiated with array-like Object as prototype to make instance non verifyable by "instanceof Array" */

Element.forgery = (function() {
	var fakeArray = {length: 0};
	var arrayMethods = Object.getOwnPropertyNames(Array.prototype);
	var descriptor;

	function Element() {}
	
	arrayMethods.forEach(function(method) {
		if (!typeof Array.prototype[method] === 'function') {
			return;
		}

		fakeArray[method] = Array.prototype[method];
	});

	for (var prop in proto) {
		if (!proto.hasOwnProperty(prop)) {
			continue;
		}

		descriptor = Object.getOwnPropertyDescriptor(proto, prop);
		Object.defineProperty(fakeArray, prop, descriptor);
	}

	Element.prototype = fakeArray;
	Element.prototype.constructor = Element;

	return function() {
		return new Element;
	}
})();

module.exports = Element;
