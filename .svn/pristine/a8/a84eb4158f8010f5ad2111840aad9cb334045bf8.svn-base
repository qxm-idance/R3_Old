/**
 * Created by wanglei on 16/8/17.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import HandsetCategory from './category/HandsetCategory.vue';
import HandsetDetail from './details/HandsetDetail.vue';

Vue.use(VueRouter);

// 创建 VueRouter 实例 (可以传入配置参数进行定制)
let router = new VueRouter({
  hashbang: false
});

// 添加路由规则
router.map({
  '/category': {
    name: 'handsetCategory',
    component: HandsetCategory
  },
  '/detail': {
    name: 'handsetDetail',
    component: HandsetDetail
  }
});

// 默认路由
router.redirect({
  '*': '/category'
});

export default router;
