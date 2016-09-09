import { sync } from 'vuex-router-sync';

import router from './router';
import store from './vuex/store';

import App from './App.vue';

// adds a route module into the store
sync(store, router);

// 路由会创建一个 App 实例，并且挂载到选择符 app 匹配的元素上
router.start(App, 'app');
