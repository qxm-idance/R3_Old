/**
 * 如果多个组件使用相似的计算属性来获取 state 时, 由于计算属性的 getters 也只是普通函数，你可以把它们独立出来放在一个单独的文件里，以实现在多个组件之间的共享.
 * Created by wanglei on 16/8/17.
 */
export const loading = (state) => {
  let show = state.app.showLoading;
  let label = state.app.loadingLabel;
  return {show, label};
};
