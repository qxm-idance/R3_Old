var RE = /(\\)?(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|S)|./g;

module.exports = {
	jsToDotNet: function(format) {

	},
	dotNetToJs: function(format) {
		var specifiers = format.match(RE) || [];

		return specifiers.map(function(specifier) {
			switch(specifier) {
				case 'ddd':
					return 'D';
				case 'dddd':
					return 'DD';
				case 'M':
					return 'm';
				case 'MM':
					return 'mm';
				case 'MMM':
					return 'M';
				case 'MMMM':
					return 'MM';
				case 'yy':
					return 'yy';
				case 'yyyy':
					return 'yyyy';
				default:
					return specifier;
			}
		}).join('');
	}
};
