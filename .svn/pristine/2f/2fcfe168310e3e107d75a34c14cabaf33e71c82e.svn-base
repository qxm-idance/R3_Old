/**
  name: Datatables select filter
  type: ui
  desc: >
    Filters table based on select value
  options:
    column:
      Column index to filter against
*/
module.exports = {
  initialize: function() {
    this.$events.on('change', this._change.bind(this));
  },

  /**
    desc: Standard method for getting filter value.
    */
  filters: function() {
    return [{
      "type": "equal",
      "name": this.$options.column,
      "value": this.$extensions.select.getValue()
    }];
  },

  _change: function() {
    this.$events.trigger('filterChanged');
  }
};
