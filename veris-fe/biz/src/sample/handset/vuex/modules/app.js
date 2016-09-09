/**
 * Created by wanglei on 16/8/18.
 */
import { UPDATE_BREADCRUMBS } from '../mutation-types';

// initial state
const state = {
  breadcrumbs: [{
    name: 'category',
    link: 'category'
  }]
};

// mutations
const mutations = {
  [UPDATE_BREADCRUMBS] (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs;
  }
};

export default {
  state,
  mutations
};
