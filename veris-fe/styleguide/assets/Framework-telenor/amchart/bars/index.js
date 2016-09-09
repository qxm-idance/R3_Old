var SELECTORS = {
	itemBars: 'svg > g:nth-child(6) > g > g'
};

var helper = require('../helper');

var AmCharts = require('../amcharts/amcharts');

var columnWidth = 0.8;

require('../theme');

require('../amcharts/serial');

module.exports = {
	ready: function() {
		this.data = this.$options.invoices;

		helper.init(this, {
			units: 'kr',
			type: 'serial',
			categoryField: 'X',
			marginRight: 10,
			startDuration: 0.5,
			hideBalloonTime: 500,
			balloon: {
				maxWidth: 150
			},
			columnWidth: columnWidth,
			startEffect: 'easeOutSine',
			chartCursor: {
				cursorAlpha: 0,
				valueBalloonsEnabled: false,
				categoryBalloonEnabled: false,
				zoomable: false
			},
			valueAxes: [{
				gridAlpha: 0.1,
				minimum: 0
			}],
			graphs: [{
				type: 'column',
				valueField: 'Y',
				lineColorField: 'activeLine',
				fillColorField: 'activeColor',
				colorField: 'activeColor',
				alphaField: 'alpha',
				fillAlphas: 1,
				lineAlpha: 1,
				urlField: 'Url',
				patternField: 'Pattern',
				cornerRadiusTop: 2,
				bulletAlpha: 0,
				bulletBorderAlpha: 0,
				bulletOffset: -30,
				bulletSize: 20,
				bullet: 'none'
			}]
		});

		this.$options.dataProvider.forEach(function(v) {
			if (v.IconOnly) {
				v.alpha = 0;
				v.activeLine = 'rgba(0,0,0,0)';
				v.Y = 0;

				return;
			}

			var color = helper.gradient(v.Color);

			v.activeColor = color.gradient;
			v.activeLine = color.stroke ? color.stroke : undefined;
		});

		this.hasIconOnly = this.$options.dataProvider.reduce(function(val, data) {
			return val || data.IconOnly;
		}, false);

		this._originData = this.$options.dataProvider;

		this._originData.forEach(function(data) {
			data.originValue = data.Y;
		});

		this._originLabels = this.$options.dataProvider.map(function(provider) {
			return provider.X;
		});

		this.$options.graphs[0].balloonFunction = this._showBalloon.bind(this);

		// Add content
		this.addGuides();

		helper.onResize(this);

		var count = this.$options.count;

		if (typeof count !== 'undefined') {
			this.changeCount(count);
		}

		helper.whenInViewport(this);
	},

	addGuides: function() {
		this.$options.guides = [];

		if (this.$options.guide) {
			this.$options.guides.push({
				value: this.$options.guide,
				lineColor: helper.colors.dark,
				dashLength: 4,
				lineAlpha: 1,
				lineThickness: 1
			});
		}
	},

	_showBalloon: function(balloonInfo) {
		return this._getTooltipHTML(balloonInfo.dataContext);
	},

	_getTooltipHTML: function(item) {
		return '<div data-type="tooltip">' + item.text + '</div>';
	},

	//<realDenger> never try do it at home, it can be dengerous for your life
	_getTooltip: function() {
		var $tooltip = this.$el.find('[data-type="tooltip"]');

		return $tooltip.length === 0 ? null : $tooltip;
	},

	_findTooltip: function(callback) {
		var $tooltip = this._getTooltip();

		if ($tooltip !== null) {
			callback($tooltip);

			return true;
		}

		setTimeout(this._findTooltip.bind(this, callback), 50);
	},

	_tooltipMouseLeave: function() {
		this.inTooltip = false;

		this.chart.hideBalloon();
	},

	_tooltipMouseEnter: function() {
		this.chart.balloon.showBalloon(this.chart.balloon.text);

		this.inTooltip = true;

		this._getTooltip().css({
			'pointer-events': 'auto'
		});
		this._getTooltip().on('mouseleave',this._tooltipMouseLeave.bind(this));
	},

	_initTooltip: function($tooltip) {
		$tooltip.css({
			'pointer-events': 'auto'
		});
		$tooltip.on('mouseenter', this._tooltipMouseEnter.bind(this));
	},

	_showBalloonReal: function() {
		this.inTooltip = false;

		this._oldShowBalloon.apply(this.chart, arguments);

		this._findTooltip(this._initTooltip.bind(this));
	},

	_hideBalloonReal: function() {
		if (this.inTooltip) {
			return;
		}

		this._oldHideBalloon.apply(this.chart, arguments);
	},

	_initEvents: function() {
		this._oldHideBalloon = this.chart.hideBalloonReal;

		this.inTooltip = false;

		this._oldShowBalloon = this.chart.showBalloonReal;

		this.chart.hideBalloonReal = this._hideBalloonReal.bind(this);

		this.chart.showBalloonReal = this._showBalloonReal.bind(this);

		this.chart.addListener('clickGraphItem', this._clickItem.bind(this));
		this._updateItemsCursor();
	},

	_clickItem: function(ev) {
		var url = ev.item.dataContext.Url;

		if (url) {
			this.$tools.util.redirect(url);
		}
	},

	_updateItemsCursor: function() {
		var dataProvider = this.chart.dataProvider;

		this.$el.find(SELECTORS.itemBars).each(function(index) {
			if (dataProvider[index].Url) {
				this.classList.add('with-action');
			}
		});
	},
	//</realDenger>

	changeCount: function(count) {
		this.$options.dataProvider = this._originData.reverse();
		this.draw();
		this.chart.animateAgain();
	},

	_showExtremLabels: function() {
		this._showAllLabels();

		if (this.$options.dataProvider.length < 3) {
			return;
		}

		for (var i = 1; i < this.$options.dataProvider.length - 1; ++i) {
			this.$options.dataProvider[i].X = '';
		}
	},

	_showAllLabels: function() {
		var length = this.$options.dataProvider.length;

		this.$options.dataProvider.forEach(function(data, i) {
			data.X = this._originLabels[length - 1 - i];
		}.bind(this));
	},

	_changeCountHandler: function(e, count) {
		this._changeCount(count);

		this.draw();

		this.chart.animateAgain();
	},

	draw: function() {
		helper.reset(this.chart);
		var box = this.$components.chart.$el.empty();

		// Customize horizontal chart
		var min = this.$el.width() < 768,
			max;

		this.$options.rotate = min;
		this.$options.fontSize = min ? 11 : 13;
		this.$options.graphs[0].customBulletField = min ? '' : 'Bullet';
		this.$options.graphs[0].gradientOrientation = min ? 'horizontal' : 'vertical';
		this.$options.valueAxes[0].unit = ' ' + this.$options.units;

		if (this.$options.showAvg) {
			var sum = this.$options.dataProvider.reduce(function(val, data) {
					return data.ExcludeFromAvg ? val : data.originValue + val;
				}, 0),
				count = this.$options.dataProvider.filter(function(data) {
					return !data.ExcludeFromAvg;
				}).length,
				avg = count === 0 ? 0 : sum / count;

			if (this.chart) {
				var avgs = this.$options.guides.filter(function(guide) {
					return guide.id === 'avg-line';
				});

				avgs.forEach(function(guide) {
					guide.value = avg;
				});
			} else {
				this.$options.guides.push({
					value: avg,
					lineColor: helper.colors.dark,
					dashLength: 4,
					lineAlpha: 1,
					lineThickness: 1,
					above: true,
					id: 'avg-line'
				});
			}
		}

		if (typeof this.$options.minHeight !== 'undefined') {
			max = this.$options.dataProvider.reduce(function(val, data) {
				return val < data.originValue ? data.originValue : val;
			}, Number.MIN_VALUE);

			this.$options.dataProvider.forEach(function(data) {
				if (data.IconOnly) {
					return;
				}

				data.Y = (data.originValue / max) > this.$options.minHeight ? data.originValue : this.$options.minHeight * max;
			}.bind(this));
		}

		//Please forgive me for this hell
		if (this.hasIconOnly && this.$options.graphs[0].bulletOffset < 0 && this.$components.temp) {
			var $temp = this.$tools.dom.find('<div />');

				$temp.css({
					opacity: 0,
					width: box.width(),
					height: box.height()
				});

				box.before($temp);

				var newChart = AmCharts.makeChart($temp.get(0), this.$options),
					axis = newChart.valueAxes[0],
					value = axis.coordinateToValue(this.$options.graphs[0].bulletSize - this.$options.graphs[0].bulletOffset);

				max = axis.max;

				this.$options.dataProvider.forEach(function(data) {
					if (data.IconOnly) {
						data.Y = min ? value : max - value;
					}
				});

				helper.reset(newChart);

				$temp.remove();
		}

		if (!min && typeof this.$options.maxLabels !== 'undefined' && this.$options.maxLabels < this.$options.dataProvider.length) {
			this._showExtremLabels();
		} else {
			this._showAllLabels();
		}

		var maxWidth = this.$options.maxWidth,
			currentWidth = 1 / this.$options.dataProvider.length;

		this.$options.columnWidth = (!min && typeof maxWidth !== 'undefined' && currentWidth > maxWidth) ? maxWidth / currentWidth : columnWidth;

		// Draw chart
		this.chart = AmCharts.makeChart(box.get(0), this.$options);

		this._initEvents();
	}
};

