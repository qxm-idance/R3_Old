import Vue from 'vue';
import Button from 'taurus/components/button/button';
import Collapse from 'taurus/directives/collapse/collapse';

// Vue.use(Collapse);

new Vue({
  el: 'body',
  directives: {
    Collapse
  },
  components: {
    't-button': Button
  },
  props: {
    expanded: {
      type: Boolean,
      twoway: true,
      default: true
    }
  },
  data: {
    btnText: '展开'
  },
  methods: {
    expandedVal: function () {
      this.expanded = !this.expanded;
    }
  },
  watch: {
    'expanded': function (val) {
      this.btnText = val ? '展开' : '收起';
    }
  }
});
