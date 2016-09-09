var isMobile = require('Common/aura/js/base').browser.isMobile;

/**
  name: Datepicker
  type: ui
  desc: >
    Provides functionality of choosing single date or date range
    Works as a component or an extension
    Allows you to restrict some dates from being selected
    (requires to be wrapped with `form` with `form/validation`)

    There is desktop and mobile versions
    Desktop one wraps http://keith-wood.name/datepick.html
    Mobile one uses `input[type=date]` native functionality

  options:
    rangeSelect: Enables range mode in datepicker
    daterangeMessage: Error message to be shown when end date is less then start date
    defaultStartDate: ISO Date string `yyyy-mm-dd` set as start date value on reset or after clearing the field
    defaultEndDate: End date `yyyy-mm-dd` set on reset or clear
    dateFormat: Format of displaying dates (`yyyy-mm-dd` by default)
    dateMessage: Message shown if entered value in not valid
    disabledDates: Comma-separated list of ISO dates that should be disabled
    disabledDatesMessage: message that is shown if selected date is disabled
    minDate: ISO date string disables all dates before given value
    minDateMessage: Error message to be shown when selected date is less than minimal
    maxDate: ISO date string disables all dates after given value
    maxDateMessage: Error message to be shown when selected date is greater than maximal
    monthsToShow: Number of months shown together in calendar
    monthHeaderFormat: Format of month headers shown in popup (`MM yyyy` gives us `novemder 2015`)
    monthNames: Comma-separated list of full month names (month header in calendar)
    monthNamesShort: Comma-separated list of short month names (month name in day title)
    dayNames: Comma-separated list of full day names (title for column headers in calendar)
    dayNamesShort: Comma-separated list of short day names (day name in day title)
    dayNamesMin: Comma-separated list of short day names (label for column headers in calendar)
    applyText: Label for `apply` button in Range
    todayText: Label for `Show current month` link
    todayStatus: Title for `Show current month` link
    prevStatus: Title for `Prev month` link
    nextStatus: Title for `Next month` link
    closeStatus: Title for `Close` button
    clearStatus: Title for `Clear` button
    dayStatus: a day title in calendar
    alwaysFilled: Boolean. Means that value can not be empty (defaults will be used on reset or clear)

  events:
    change: Fires when date is changed
*/
module.exports = isMobile ? require('./mobile') : require('./desktop');

/**
  desc: >
    Returns object with selected startDate and endDate as strings `yyyy-mm-dd`
*/
function getDates() {}

/**
  desc: >
    Sets default values to start and end dates or clears them if no defaults set
*/
function reset() {}
