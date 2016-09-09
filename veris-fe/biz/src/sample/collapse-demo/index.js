import Vue from 'vue';
import Panel from 'taurus/components/panel/panel';

new Vue({
  el: '#collapse',
  components: {
    't-panel': Panel
  },
  data: {
    key: 1,
    prefixCls: 't-panel',
    isActive: false,
    text: '1fsadfasfa'
  },
  methods: {
    print: function () {
      console.log('ttt');
    }
  }
});
