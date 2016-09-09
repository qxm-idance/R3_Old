import Vue from 'vue';
import MyBaseComp from './my-component';

var root, inst;

// 创建根组件
root = new Vue({
  el: 'body',
  components: {
    MyBaseComp
  },
  data: function () {
    return {
      _created: false
    };
  },
  methods: {
    // 创建组件按钮单击事件回调方法
    createComponent: function () {
      var vm;
      if (this.$data._created === false) {
        vm = new MyBaseComp({
          el: '#cntrCreate',
          replace: false,
          propsData: {
            msg: '我是第三个组件!'
          }
        });
        // 输出组件实例
        msg(vm);
        this.$data._created = true;
      } else {
        alert('第三个组件已经创建!');
      }
    }
  }
});

// 输出根组件实例对象到控制台
msg(root);

// 输出组件实例
inst = new MyBaseComp({
  el: '#cntr',
  replace: false,
  propsData: {
    msg: '我是第二个组件!'
  }
});

// 输出信息到控制台
function msg (info) {
  try {
    console.log(info);
  } catch (e) {}
}

// 输出基础组件实例到控制台
msg(inst);
