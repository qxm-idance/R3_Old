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
    prefixCls: 'ant-collase',
    isActive: false,
    text: '1fsadfasfa'
  },
  methods: {
    print: function () {
      console.log('ttt');
    }
  }
});
