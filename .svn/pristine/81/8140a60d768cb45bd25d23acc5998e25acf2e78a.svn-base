var template = require('./../html/default.html');
var Datepicker = require('./pageObject.js');
var $ = require('jquery');

module.exports.setUp = function (spec) {
	helpers.aura.setUp(spec, template, 'datepicker');
	spec.dp = new Datepicker(spec.component);
};

module.exports.tearDown = function(spec) {
	$('.datepick-popup').remove();
	helpers.aura.tearDown(spec);
};