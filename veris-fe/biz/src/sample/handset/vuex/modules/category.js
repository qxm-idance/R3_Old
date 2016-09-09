/**
 * Created by wanglei on 16/8/17.
 */
import {
    UPDATE_BRAND,
    UPDATE_MODEL,
    UPDATE_COLOR
} from '../mutation-types';

// initial state
const state = {
  brand: 'Apple',
  model: '64G',
  color: 'Grey'
};

// mutations
const mutations = {
  [UPDATE_BRAND] (state, brand) {
    state.brand = brand;
  },
  [UPDATE_MODEL] (state, model) {
    state.model = model;
  },
  [UPDATE_COLOR] (state, color) {
    state.color = color;
  }
};

export default {
  state,
  mutations
};
