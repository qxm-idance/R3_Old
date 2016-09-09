/**
 * Created by wanglei on 16/8/23.
 */
import Vue from 'vue';
import Breadcrumbs from 'taurus/components/breadcrumbs/Breadcrumbs.vue';

/* eslint-disable no-new */
new Vue({
  el: 'body',

  components: { Breadcrumbs },

  data () {
    return {
      breadcrumbs: [{
        name: 'category',
        link: 'category'
      }]
    };
  }
});
