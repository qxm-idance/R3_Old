/**
 * Created by wanglei on 16/8/17.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/logger';

import app from './modules/app';
import category from './modules/category';
import details from './modules/details';

Vue.use(Vuex);

const isDev = process.env.NODE_ENV === 'development';

Vue.config.debug = isDev;

export default new Vuex.Store({
  modules: {
    app,
    category,
    details
  },
  strict: isDev,
  middlewares: isDev ? [createLogger()] : []
});
