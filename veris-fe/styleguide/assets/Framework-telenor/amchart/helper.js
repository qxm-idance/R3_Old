require('./theme');

var tooltipTemplate = require('./html/tooltip.html');
var AmCharts = require('./amcharts/amcharts');

var helper = {},
  $ = require('jquery');

// Default options for all charts
helper.defaults = {
  theme: 'onescreen',
  panEventsEnabled: false
};

// Colors from the theme file
helper.colors = AmCharts.themes.onescreen.colors;
helper.series = AmCharts.themes.onescreen.series;
helper.gradients = AmCharts.themes.onescreen.gradients;

// Init a chart module
helper.init = function(module, options) {
  module.$options = $.extend({}, helper.defaults, options, module.$options);
  module.$options.dataProvider = helper.data(module);


	module.$options.dataProvider.forEach(function(data) {
		var tooltipData = $.extend({}, (data.tooltipData || data.TooltipData), {
			ButtonLabel: module.$options.buttonLabel,
			InvoiceNumberLabel: module.$options.invoiceNumberLabel
		});
		data.text = module.$tools.template.parse(tooltipTemplate)(tooltipData);
	});

  // Fix config flag support
  module.$options.depth3D = module.$options.depth3d || module.$options.depth3D || 0;
  module.$options.gradientRatio = [0, module.$options.gradient || 0.1];
  module.$options.startDuration = module.$options.startDuration;
  module.$options.pullOutDuration = module.$options.pullOutDuration;
};

// Get chart data from global or method
helper.data = function(module) {
	var telenor = window.TN;

	if (module.$options.key && telenor) {
		return telenor.config[module.$options.key];
	}

	if (module.data) {
		if (typeof module.data === 'function') {
			return module.data();
		}
		return module.data;
	}
};

// Get a color value from name or index
helper.color = function(id) {
  return helper.colors[id] || helper.series[id] || helper.series[0];
};

// Get a color gradient from name or index
helper.gradient = function(id) {
  return helper.gradients[id] || helper.color(id);
};

// Reset a chart object
helper.reset = function(chart) {
  if (!chart) { return; }
  chart.invalidateSize();
  chart.clear();
};

helper.onResize = function(module) {
  $(window).resize(module.$tools.helper.throttle(module.draw.bind(module), 500));
};

// Wait until element is in viewport
helper.whenInViewport = function(module) {
  var check = function() {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();
    var elemTop = module.$el.offset().top - 100;
    var elemBottom = elemTop + module.$el.height() - 100;
    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) || (elemTop < docViewTop);
  };

  var call = function() {
    if (check()) {
      $(window).off('scroll', call);
      module.draw();
    }
  };

  $(window).on('scroll', call);
  call();
};

module.exports = helper;

AmCharts.isReady = true;
