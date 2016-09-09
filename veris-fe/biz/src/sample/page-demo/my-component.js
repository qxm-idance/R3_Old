/**
 * 这是一个简单的组件，它模拟了基础组件实现，这种实现方式与.vue文件内定义的组件有区别!
 */
import Vue from 'vue';

var MyBaseComp = Vue.extend({
  template: '<h2 style="color:red">{{ msg }}</h2>',
  props: {
    msg: {
      type: String,
      default: '我是个组件'
    }
  }
});

module.exports = MyBaseComp;
