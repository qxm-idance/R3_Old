<template>
  <div class="ose-sample-handset-detail">
    <div class="ose-sample-handset-detail-output">{{params}}</div>
    <img src="../../../assets/img/logo.png">
    <img src="/assets/img/main_bg.png">
  </div>
</template>

<script>
  import { updateBreadcrumbs } from '../vuex/actions';

  export default {
    name: 'HandsetDetail',

    vuex: {
      getters: {
        params: function ({ route }) {
          return route.query.params;
        }
      },
      actions: {
        updateBreadcrumbs
      }
    },

    created () {
      let breadcrumbs = [{
        name: 'category',
        link: 'category'
      }, {
        name: 'detail',
        link: 'detail?params=' + this.params
      }];
      this.updateBreadcrumbs(breadcrumbs);
    }
  };
</script>

<style>
  .ose-sample-handset-detail {
    margin-top: 40px;
  }

  .ose-sample-handset-detail-output {
    margin-top: 20px;
    color: darkred;
  }
</style>