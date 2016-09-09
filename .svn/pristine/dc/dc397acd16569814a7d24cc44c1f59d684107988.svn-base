<template>
  <div class="ose-sample-handset">
    <breadcrumbs :breadcrumbs="breadcrumbs"></breadcrumbs>
    <router-view></router-view>
  </div>
</template>

<script>
  import store from './vuex/store';
  import Breadcrumbs from 'taurus/components/breadcrumbs/Breadcrumbs.vue';

  export default {
    name: 'Handset',

    store: store,

    components: {
      Breadcrumbs
    },

    vuex: {
      getters: {
        breadcrumbs: function ({ app }) {
          return app.breadcrumbs;
        }
      }
    }
  };
</script>

<style>
  .ose-sample-handset {
    width: 100%;
    text-align: center;
  }
</style>