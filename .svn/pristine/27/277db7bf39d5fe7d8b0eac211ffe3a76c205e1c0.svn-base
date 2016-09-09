var Element = require('Framework/element/public.js');
var NUMBER_RE = /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:[,.]\d+)?$/;

var datepick = require('Framework/element/jq-plugins/jquery.datepick');

Element.validator.addMethod("regex", function(value, element, params) {
	var match;

	if (this.optional(element)) {
		return true;
	}

	match = new RegExp(params).exec(value);

	return (match && (match.index === 0) && (match[0].length === value.length));
});

Element.validator.addMethod("nonalphamin", function(value, element, nonalphamin) {
	var match;

	if (nonalphamin) {
		match = value.match(/\W/g);
		match = match && match.length >= nonalphamin;
	}

	return match;
});

Element.validator.addMethod("equalto", function(value, element, confirmName) {
	return value === Element.find(element).closest('form').find('[name="' + confirmName + '"]').val();
});

Element.validator.addMethod('date', function(value, element) {
	if (element.type === 'date' || !value) {
		return true;
	}

	var separator = element.dataset.separator.replace(/\s/g, '').replace(/\-/g, '\\-');
	var rgx = new RegExp('\\s*' + separator + '\\s*');

	return value.split(rgx)
		.every(function(dateString) {
			return convertDateToISO(dateString, element.dataset.dateFormat);
		});
});

Element.validator.addMethod('daterange', function(value, element) {
	var separator = element.dataset.separator.replace(/\s/g, '').replace(/\-/g, '\\-');
	var rgx = new RegExp('\\s*' + separator + '\\s*');

	var dates = value.split(rgx)
		.map(function(dateString) {
			return convertDateToISO(dateString, element.dataset.dateFormat);
		});

	if (dates[0] && dates[1]) {
		return dates[1] >= dates[0];
	}

	return !dates[0] && !dates[1];
});

Element.validator.addMethod("mindate", function(value, element, minDateString) {
	return value.split(element.dataset.separator)
		.every(function(dateString) {
			if (element.type !== 'date') {
				dateString = convertDateToISO(dateString, element.dataset.dateFormat);
			}

			return !dateString || dateString >= minDateString;
		});
});

Element.validator.addMethod("maxdate", function(value, element, maxDateString) {
	return value.split(element.dataset.separator)
		.every(function(dateString) {
			if (element.type !== 'date') {
				dateString = convertDateToISO(dateString, element.dataset.dateFormat);
			}

			return !dateString || dateString <= maxDateString;
		});
});

Element.validator.addMethod("disableddates", function(value, element, disabledDates) {
	return value.split(element.dataset.separator)
		.every(function(dateString) {
			if (element.type !== 'date') {
				dateString = convertDateToISO(dateString, element.dataset.dateFormat);
			}

			return !dateString || disabledDates.split(',').indexOf(dateString) === -1;
		});
});

Element.validator.addMethod("enableddates", function(value, element, disabledDates) {
	return value.split(element.dataset.separator)
		.every(function(dateString) {
			if (element.type !== 'date') {
				dateString = convertDateToISO(dateString, element.dataset.dateFormat);
			}

			return !dateString || disabledDates.split(',').indexOf(dateString) !== -1;
		});
});

function convertDateToISO(dateString, format) {
	try {
		return datepick.formatDate('yyyy-mm-dd', datepick.parseDate(format, dateString));
	} catch (e) {
		return '';
	}
}

Element.validator.methods.number = function(value, element) {
	return this.optional(element) || NUMBER_RE.test(value);
};

Element.validator.methods.min = function(value, element, min) {
	value = parseFloat(value.replace(',', '.'));

	return this.optional(element) || value >= min;
};

Element.validator.methods.max = function(value, element, max) {
	value = parseFloat(value.replace(',', '.'));

	return this.optional(element) || value <= max;
};

var oldMin = Element.validator.messages.min;

Element.validator.messages.min = function(param, element) {
	if (!NUMBER_RE.test(Element.find(element).val())) {
		return Element.find(element).data('valNumber') || Element.validator.messages.number;
	} else {
		return oldMin(param, element);
	}
};

var oldMax = Element.validator.messages.max;

Element.validator.messages.max = function(param, element) {
	if (!NUMBER_RE.test(Element.find(element).val())) {
		return Element.find(element).data('valNumber') || Element.validator.messages.number;
	} else {
		return oldMax(param, element);
	}
};
