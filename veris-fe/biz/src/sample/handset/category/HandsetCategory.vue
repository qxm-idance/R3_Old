<template>
  <div class="ose-sample-handset-cate">
    <div class="ose-sample-handset-cate-input">
      Brand: <input type="text" :value="brand" v-on:change="updateBrand"/>
      Model: <input type="text" :value="model" v-on:change="updateModel"/>
      Color: <input type="text" :value="color" v-on:change="updateColor"/>
      <button v-on:click="getDetail">GetDetail</button>
    </div>
  </div>
</template>

<script>
  import join from 'underscore.string/join';
  import {
      updateBreadcrumbs,
      updateBrand,
      updateModel,
      updateColor
  } from '../vuex/actions';

  export default {
    name: 'HandsetCategory',

    vuex: {
      getters: {
        brand: function ({ category }) {
          return category.brand;
        },
        model: function ({ category }) {
          return category.model;
        },
        color: function ({ category }) {
          return category.color;
        }
      },

      actions: {
        updateBreadcrumbs,
        updateBrand,
        updateModel,
        updateColor
      }
    },

    created () {
      let breadcrumbs = [{
        name: 'category',
        link: 'category'
      }];
      this.updateBreadcrumbs(breadcrumbs);
    },

    methods: {
      getDetail: function () {
        let params = join('-', this.brand, this.model, this.color);
        this.$route.router.go('/detail?params='.concat(params));
      }
    }
  };
</script>

<style>
  .ose-sample-handset-cate {
    margin-top: 40px;
  }

  .ose-sample-handset-cate-input {
    margin-top: 20px;
  }
</style>