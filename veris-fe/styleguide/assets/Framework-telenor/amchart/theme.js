module.exports = {};

var AmCharts = require('./amcharts/amcharts'),
  colors = {
    white:  '#ffffff',
    black:  '#474747',
    dark:   '#757575',
    grey:   '#d1d1d1',
    blue:   '#038cd6',
    green:  '#43c682',
    yellow: '#ffb900',
    red:    '#db5451',
    purple: '#6b2377'
  },

  gradients = {
    blue:     { gradient: ['#0278b8', '#029df0'], stroke: '#02679e' },
    green:    { gradient: ['#3eb577', '#43c682'], stroke: '#369e68' },
    red:      { gradient: ['#db5451', '#ff615e'], stroke: '#b24442' },
    yellow:   { gradient: ['#ffb900', '#ffcf4c'], stroke: '#e5a800' },
    purple:   { gradient: ['#6b2377', '#9f34b2'], stroke: '#42154a' }
  },

  series = [
    colors.grey,
    colors.blue,
    colors.green,
    colors.yellow,
    colors.red,
    colors.purple,
    colors.dark
  ];

AmCharts.themes.onescreen = {
  themeName: 'onescreen',
  background: colors.grey,
  colors: colors,
  gradients: gradients,
  series: series,

  AmChart: {
    color: colors.black,
    backgroundColor: colors.white,
    fontFamily: 'arial, sans-serif',
    fontSize: 13,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    startDuration: 0
  },

  AmCoordinateChart: {
    colors: series,
    gridAlpha: 0,
    color: colors.dark
  },

  AmSlicedChart: {
    colors: series,
    outlineColor: colors.white,
    outlineThickness: 0,
    outlineAlpha: 1
  },

  AmRectangularChart: {
    zoomOutButtonColor: colors.black,
    zoomOutButtonRollOverAlpha: 0.15
  },

  AxisBase: {
    color: colors.dark,
    axisAlpha: 0,
    gridAlpha: 0
  },

  ChartScrollbar: {
    backgroundColor: colors.black,
    backgroundAlpha: 0.12,
    graphFillAlpha: 0.5,
    graphLineAlpha: 0,
    selectedBackgroundColor: colors.white,
    selectedBackgroundAlpha: 0.4,
    gridAlpha: 0.15
  },

  ChartCursor: {
    cursorColor: colors.dark,
    color: colors.white,
    cursorAlpha: 0.5
  },

  AmLegend: {
    color: colors.dark,
    fontSize: 13
  },

  AmGraph: {
    fillColors: colors.grey,
    bullet: 'round',
    bulletSize: 6,
    bulletColor: colors.blue,
    balloonColor: colors.white,
    lineAlpha: 1,
    lineThickness: 1,
    fillAlphas: 0.3,
    bulletBorderAlpha: 1,
    bulletBorderColor: colors.blue,
    bulletBorderThickness: 2
  },

  AmBalloon: {
    color: colors.dark,
    fillAlpha: 1,
    borderAlpha: 1,
    borderThickness: 1,
    fillColor: colors.white,
    borderColor: colors.grey,
    fadeOutDuration: 0,
    adjustBorderColor: false,
    fixedPosition: true,
    shadowAlpha: 0,
    shadowColor: colors.dark
  },

  AmAngularGauge: {
    thousandsSeparator: '',
    fontFamily: 'telenorlight, arial'
  },

  GaugeAxis: {
    tickAlpha: 0,
    tickLength: 20,
    minorTickLength: 15,
    axisThickness: 0,
    showFirstLabel: false,
    showLastLabel: false,
    bottomTextColor: colors.black,
    bottomTextBold: false,
    bottomTextFontSize: 30,
    bottomTextYOffset: -23,
    bandOutlineColor: colors.white,
    bandOutlineThickness: 2,
    bandOutlineAlpha: 1,
    axisAlpha: 0,
    bandAlpha: 1
  },

  GaugeArrow: {
    color: colors.black,
    clockWiseOnly: true,
    alpha: 1,
    nailAlpha: 1,
    radius: 50,
    innerRadius: 0,
    nailRadius: 0,
    startWidth: 8,
    endWidth: 2,
    borderAlpha: 0,
    nailBorderAlpha: 0
  },

  TrendLine: {
    lineColor: colors.black,
    lineAlpha: 1
  },

  AreasSettings: {
    alpha: 0.8,
    color: colors.yellow,
    colorSolid: colors.dark,
    unlistedAreasAlpha: 0.4,
    unlistedAreasColor: colors.black,
    outlineColor: colors.white,
    outlineAlpha: 0.5,
    outlineThickness: 0.5,
    rollOverColor: colors.blue,
    rollOverOutlineColor: colors.white,
    selectedOutlineColor: colors.white,
    selectedColor: colors.red,
    unlistedAreasOutlineColor: colors.white,
    unlistedAreasOutlineAlpha: 0.5
  },

  LinesSettings: {
    color: colors.black,
    alpha: 0.8
  },

  ImagesSettings: {
    alpha: 0.8,
    labelColor: colors.black,
    color: colors.black,
    labelRollOverColor: colors.blue
  },

  ZoomControl: {
    zoomControlEnabled: false,
    panControlEnabled: false
  },

  SmallMap: {
    mapColor: colors.black,
    rectangleColor: colors.red,
    backgroundColor: colors.white,
    backgroundAlpha: 0.7,
    borderThickness: 1,
    borderAlpha: 0.8
  }

};
