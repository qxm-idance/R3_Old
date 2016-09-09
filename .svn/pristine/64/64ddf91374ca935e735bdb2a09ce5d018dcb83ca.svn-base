var AmCharts = require('../amcharts/amcharts'),
  helper = require('../helper');

require('../amcharts/serial');

module.exports = {
  ready: function() {
    helper.init(this, {
      units: "kr",
      type: "serial",
      categoryField: "x",
      valueField: "y",
      startAlpha: 0,
      startDuration: .25,
      startEffect: "easeOutSine",
      chartCursor: {
        cursorAlpha: 0,
        bulletSize: 10,
        bulletsEnabled: true,
        valueBalloonsEnabled: true,
        categoryBalloonEnabled: false,
        zoomable: false
      },
      valueAxes: [{
        gridAlpha: .1,
        minimum: 0
      }],
      categoryAxis: {
        gridPosition: "middle",
        gridAlpha: .1
      },
      graphs:[{
        type: "line",
        valueField: "y",
        urlField: "href",
        lineThickness: 2,
        balloonText: "[[text]]",
        bulletColor: helper.colors.white
      }]
    });

    helper.whenInViewport(this);
  },

  draw: function() {
    var color = helper.color(this.$options.color),
      box = this.$components.chart.$el.empty();

    this.$options.valueAxes[0].unit = ' ' + this.$options.units;
    this.$options.graphs[0].bulletBorderColor = color;
    this.$options.graphs[0].bulletColor = helper.color('white');
    this.$options.graphs[0].lineColor = color;
    this.$options.graphs[0].fillColors = [helper.gradient(this.$options.color).gradient[0], helper.color('white')];

    this.chart = AmCharts.makeChart(box.get(0), this.$options);
  }
};
