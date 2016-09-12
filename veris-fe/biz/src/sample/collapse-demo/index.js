import Vue from 'vue';
import Panel from 'taurus/components/panel/panel';
import Collapse from 'taurus/components/collapse/collapse';

new Vue({
  el: 'body',
  components: {
    't-panel': Panel,
    't-collapse': Collapse
  },
  data: {
    key: 1,
    prefixCls: 't-collase',
    isActive: false,
    text1: 'di yi ge',
    text2: 'di er ge',
    text3: 'di san ge'
  },
  methods: {
    _onChange: function (key) {
      console.log(key);
    }
  }
});
