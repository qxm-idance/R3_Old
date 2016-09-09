var adapters = module.exports = [];

function setValidationValues(options, ruleName, value) {
	options.rules[ruleName] = value;

	if (options.message) {
		options.messages[ruleName] = options.message;
	}
}

function splitAndTrim(value) {
	return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
}

function escapeAttributeValue(value) {
	return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
}

function getModelPrefix(fieldName) {
	return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
}

function appendModelPrefix(value, prefix) {
	if (value.indexOf("*.") === 0) {
		value = value.replace("*.", prefix);
	}

	return value;
}

adapters.add = function(adapterName, params, fn) {
	if (!fn) {
		fn = params;
		params = [];
	}

	this.push({name: adapterName, params: params, adapt: fn});

	return this;
};

adapters.addBool = function(adapterName, ruleName) {
	return this.add(adapterName, function(options) {
		setValidationValues(options, ruleName || adapterName, true);
	});
};

adapters.addMinMax = function(adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
	return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function(options) {
		var min = options.params.min;
		var max = options.params.max;

		if (min && max) {
			setValidationValues(options, minMaxRuleName, [min, max]);
		} else if (min) {
			setValidationValues(options, minRuleName, min);
		} else if (max) {
			setValidationValues(options, maxRuleName, max);
		}
	});
};

adapters.addSingleVal = function(adapterName, attribute, ruleName) {
	return this.add(adapterName, [attribute || "val"], function(options) {
		setValidationValues(options, ruleName || adapterName, options.params[attribute]);
	});
};

adapters
	.addSingleVal("accept", "exts")
	.addSingleVal("regex", "pattern")
	.addSingleVal("equalto", "other")
	.addSingleVal("mindate", "value")
	.addSingleVal("maxdate", "value")
	.addSingleVal("disableddates", "value")
	.addSingleVal("enableddates", "value");

adapters
	.addBool("creditcard")
	.addBool("date")
	.addBool("daterange")
	.addBool("digits")
	.addBool("email")
	.addBool("number")
	.addBool("url");

adapters
	.addMinMax("length", "minlength", "maxlength", "rangelength")
	.addMinMax("range", "min", "max", "range");

adapters.add("required", function(options) {
	if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
		setValidationValues(options, "required", true);
	}
});

adapters.add("password", ["min", "nonalphamin", "regex"], function(options) {
	if (options.params.min) {
		setValidationValues(options, "minlength", options.params.min);
	}

	if (options.params.nonalphamin) {
		setValidationValues(options, "nonalphamin", options.params.nonalphamin);
	}

	if (options.params.regex) {
		setValidationValues(options, "regex", options.params.regex);
	}
});
