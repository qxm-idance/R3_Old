<template>
  <ul class="form-item {{ inlineClass }} {{ marginTopClass }}">
    <component :is="compType" v-for="item in labels" :label="item" :count="counts[$index]" :idx="$index" :checked="checked[$index]" :disabled="disabled[$index]" :value="values[$index]"></component>
  </ul>
</template>
<script>
import Vue from 'vue';
import Checkbox from './checkbox';
import Radiobox from './radiobox';
import CheckboxFilter from './checkbox-filter';

const CSS_INLINE = 'form-inline';
const CSS_MARGIN_TOP = 'form-row';
const SIZE_NORMAL = 'normal';
const TYPE_CHECKBOX = 'checkbox';
const TYPE_RADIOBOX = 'radiobox';
const TYPE_CHECKBOX_FILTER = 'checkbox-filter';
const DEF_VALUE = '-';

var seed = 0;

function nextName () {
  return 'tau-box-name' + seed++;
}

var BoxGroup = Vue.extend({
  name: 'taurus-box-group',
  components: {
    't-checkbox': Checkbox,
    't-radiobox': Radiobox,
    't-checkbox-filter': CheckboxFilter
  },
  created: function () {
    var count = 0;
    var i;
    if (this.type === TYPE_CHECKBOX_FILTER && this.total === true) {
      this.counts.forEach(function (item, index) {
        count += item;
      });
      this.counts = [count].concat(this.counts);
      this.labels = [this.total_label].concat(this.labels);
      if (this.total_checked) {
        for (i = this.labels.length - 1; i >= 1; i--) {
          this.checked[i] = false;
        }
        this.checked[0] = true;
      } else {
        this.checked[0] = false;
      }
    }
  },
  ready: function () {
    var children = this.$children;
    var i;
    var count = children.length;
    var itemName = nextName();
    for (i = count - 1; i >= 0; i--) {
      children[i].itemName = itemName;
      children[i].size = this.size || SIZE_NORMAL;
    }
  },
  events: {
    'radio-item-check': function (index) {
      this._changeCheckState(index, true);
    },
    'refresh-total': function () {
      var i;
      var num = 0;
      var children = this.$children;
      var count = children.length;
      for (i = count - 1; i >= 1; i--) {
        num += children[i].count;
      }
      children[0].count = num;
    }
  },
  props: {
    type: {
      default: TYPE_CHECKBOX,
      type: String
    },
    size: {
      defautl: SIZE_NORMAL,
      type: String
    },
    total: {
      default: false,
      type: Boolean,
      coerce: function (value) {
        return (value === 'true' || value === '1');
      }
    },
    total_label: {
      default: 'All',
      type: String
    },
    total_checked: {
      default: '0',
      type: Boolean,
      coerce: function (value) {
        return (value === 'true' || value === '1');
      }
    },
    disabled: {
      default: function () {
        return '0';
      },
      type: Array,
      coerce: function (value) {
        var arr,
          i,
          item;
        if (typeof value === 'string' && value !== '') {
          arr = value.split(',');
          for (i = arr.length - 1; i >= 0; i--) {
            item = arr[i];
            arr[i] = (item === 'false' || item === '0') ? false : !!item;
          }
          return arr;
        }
      }
    },
    mtop: {
      type: Boolean,
      default: function () {
        return '0';
      },
      coerce: function (value) {
        if (value === 'false' || value === '0') {
          return false;
        }
        return true;
      }
    },
    inline: {
      type: Boolean,
      default: '0',
      coerce: function (value) {
        if (value === 'false' || value === '0') {
          return false;
        }
        return true;
      }
    },
    labels: {
      default: 'Untitled',
      type: Array,
      coerce: function (value) {
        if (typeof value === 'string' && value !== '') {
          return value.split(',');
        }
      }
    },
    counts: {
      default: '0',
      type: Array,
      coerce: function (value) {
        var arr, i;
        if (typeof value === 'string' && value !== '') {
          arr = value.split(',');
          for (i = arr.length - 1; i >= 0; i--) {
            arr[i] = parseInt(arr[i], 10);
          }
          return arr;
        }
      }
    },
    values: {
      default: DEF_VALUE,
      type: Array,
      coerce: function (value) {
        if (typeof value === 'string' && value !== '') {
          return value.split(',');
        }
      }
    },
    checked: {
      default: '0',
      type: Array,
      coerce: function (value) {
        var arr,
          i,
          item;
        if (typeof value === 'string' && value !== '') {
          arr = value.split(',');
          for (i = arr.length - 1; i >= 0; i--) {
            item = arr[i];
            arr[i] = (item === 'false' || item === '0') ? false : !!item;
          }
          return arr;
        }
      }
    }
  },
  computed: {
    compType: function () {
      if (this.type === TYPE_CHECKBOX_FILTER) {
        return 't-checkbox-filter';
      } else if (this.type === TYPE_RADIOBOX) {
        return 't-radiobox';
      } else {
        return 't-checkbox';
      }
    },
    inlineClass: function () {
      if (this.type === TYPE_CHECKBOX_FILTER) {
        return CSS_INLINE;
      } else {
        return (this.inline === true) ? CSS_INLINE : '';
      }
    },
    marginTopClass: function () {
      return (this.mtop === true) ? CSS_MARGIN_TOP : '';
    }
  },
  methods: {
    /**
     * 切换勾选状态
     * @private
     * @param {Number} index 复选框序号，序号从0开始，顺序是从左至右、从上至下
     * @param {Boolean} [checked] 为true表示勾选，为false表示取消勾选，不传表示当前勾选状态取反
     */
    _changeCheckState: function (index, checked) {
      var children;
      if (index === undefined) {
        this.$children.forEach(function (item, index) {
          if (checked === true) {
            item.check();
          } else if (checked === false) {
            item.uncheck();
          } else {
            item.toggle();
          }
        });
      } else {
        children = this.$children[index];
        if (children) {
          this.$broadcast('toggle-check-state', children, checked);
        }
      }
    },
    /**
     * 取反指定索引对应的项
     * @param  {Number} index 索引值
     */
    toggle: function (index) {
      this._changeCheckState(index);
    },
    /**
     * 选择指定索引对应的项
     * @param  {Number} index 索引值
     */
    check: function (index) {
      this._changeCheckState(index, true);
    },
    /**
     * 取消选择指定索引对应的项
     * @param  {Number} index 索引值
     */
    uncheck: function (index) {
      this._changeCheckState(index, false);
    },
    /**
     * 判断给定索引值是否在
     * @private
     * @param  {Number} index 索引值
     * @return {Boolean} 如果索引值在子组件数组下标索引范围内返回true，否则返回false
     */
    _inRange: function (index) {
      var len = this.$children.length;
      var firstSeq = (this.type === TYPE_CHECKBOX_FILTER && this.total === true) ? 1 : 0;
      return (index >= firstSeq && index < len);
    },
    /**
     * 设置或返回总数，仅在checkbox-filter类型时有效
     *
     * 1. 当没传任何参数时返回所有复选框总数数组；如：
     *
     * this.$refs.myTag.count();
     *
     * 2. 当仅传递index时，如果index是数值，那么返回该索引对应的总数，
     * 如果index是数组，那么返回此数组内每一个有效的索引对应的总数；如：
     *
     * this.$refs.myTag.count(1); // 返回第二个复选框对应的总数
     * this.$refs.myTag.count([0, 1, 2]); // 返回前三个复选框对应的总数数组
     *
     * 3. 当传递了有效索引index和数值num时，将设置该索引对应复选框的总数；如：
     *
     * this.$refs.myTag.count(2, 99); // 将第三个复选框的总数设置为99
     *
     * 4. 当传递了索引数组index和总数数组num时，将设置索引数组内每一个有效索引
     * 对应的总数；如：
     *
     * // 分别将第三、四、五个复选框的总数设置为99、98和10
     * this.$refs.myTag.count([2, 3, 4], [99, 98, 10]);
     *
     * @param  {Number|Array} [index] 复选框索引或索引数组，注意，索引值从0开始，
     * 在显示总数复选按钮的时候，总数复选按钮的索引值将被忽略，索引值将从总数复选框
     * 按钮后续按钮开始算起，同样是从0开始。
     * @param  {Number|Array} [num]   复选框显示总数值或总数值数组
     * @return {Array} 返回左右除总数按钮以外的按钮对应的总数值，返回值情况参见描述，
     * 特别的，如果当前不是checkbox-filter类型，那么返回null
     */
    count: function (index, num) {
      var i, seq, len, children, result;
      if (this.type === TYPE_CHECKBOX_FILTER) {
        children = this.$children;
        len = children.length;
        if (index !== undefined) {
          if (typeof index === 'number') {
            if (this.total === true) {
              index++;
            }
            if (this._inRange(index)) {
              if (num === undefined) {
                return [children[index].count];
              } else if (typeof num === 'number') {
                children[index].count = num;
                this.$emit('refresh-total');
              }
            }
          } else if (Array.isArray(index) === true) {
            if (num === undefined) { // 返回给定索引对应的总数
              result = [];
              len = index.length;
              for (i = 0; i < len; i++) {
                seq = index[i];
                if (this.total === true) {
                  seq++;
                }
                if (this._inRange(seq)) { // 序号不在范围内将被跳过
                  result.push(children[seq].count);
                }
              }
              return result;
            } else if (Array.isArray(num) === true && index.length === num.length) {
              for (i = index.length - 1; i >= 0; i--) {
                seq = index[i];
                if (typeof seq === 'number' && typeof num[i] === 'number') {
                  if (this.total === true) {
                    seq++;
                  }
                  if (this._inRange(seq)) { // 序号不在范围内将被跳过
                    children[seq].count = num[i];
                  }
                } else {
                  continue; // 非数值项将被跳过
                }
              }
              this.$emit('refresh-total');
            }
          }
        } else if (num === undefined) { // 返回所有总数，总数按钮除外
          result = [];
          i = (this.total === true) ? 1 : 0;
          for (; i < len; i++) {
            result.push(children[i].count);
          }
          return result;
        }
      }
      return null;
    },
    /**
     * 改变指定索引对应的可用状态
     * @private
     * @param  {Number} index 索引值
     * @param  {Boolean} disabled 是否禁用，true为禁用，false为启用
     */
    _changeUsability: function (index, disabled) {
      var children;
      if (index === undefined) {
        this.$children.forEach(function (item, index) {
          if (disabled === true) {
            item.disable();
          } else {
            item.enable();
          }
        });
      } else {
        children = this.$children[index];
        if (children) {
          this.$broadcast('toggle-usability', children, disabled);
        }
      }
    },
    /**
     * 启用索引值对应的项
     * @param  {Number} index 索引值
     */
    enable: function (index) {
      this._changeUsability(index, false);
    },
    /**
     * 禁用索引值对应的项
     * @param  {Number} index 索引值
     */
    disable: function (index) {
      this._changeUsability(index, true);
    },
    /**
     * 获得索引值对应项的选择状态
     * @param  {Number}  index 索引值
     * @return {Boolean} 如果index对应的项为选中状态，那么返回true，否则返回false
     */
    isChecked: function (index) {
      var children;
      var result = [];
      if (index === undefined) {
        this.$children.forEach(function (item, index) {
          result.push(item.checked);
        });
      } else {
        children = this.$children[index];
        if (children) {
          result.push(children.checked);
        }
      }
      return result;
    },
    /**
     * 设置或返回值，当在checkbox-filter类型时只返回除总数复选按钮以外的复选按钮值
     *
     * 1. 当没传任何参数时返回所有复选框值数组；如：
     *
     * this.$refs.myTag.value();
     *
     * 2. 当仅传递index时，如果index是数值，那么返回该索引对应的值，
     * 如果index是数组，那么返回此数组内每一个有效的索引对应的值；如：
     *
     * this.$refs.myTag.value(1); // 返回第二个复选框对应的值
     * this.$refs.myTag.value([0, 1, 2]); // 返回前三个复选框对应的值数组
     *
     * 3. 当传递了有效索引index和值value时，将设置该索引对应复选框的值；如：
     *
     * this.$refs.myTag.value(2, 'abc'); // 将第三个复选框的总数设置为'abc'
     *
     * 4. 当传递了索引数组index和值数组value时，将设置索引数组内每一个有效索引
     * 对应的值；如：
     *
     * // 分别将第三、四、五个复选框的总数设置为'abc'、'def'和'ghi'
     * this.$refs.myTag.value([2, 3, 4], ['abc','def','ghi']);
     *
     * @param  {Number|Array} [index] 复选框索引或索引数组，注意，索引值从0开始，
     * 在显示总数复选按钮的时候，总数复选按钮的索引值将被忽略，索引值将从总数复选框
     * 按钮后续按钮开始算起，同样是从0开始。
     * @param  {Number|Array} [value]   复选框按钮对应的值或值数组
     * @return {Array} 返回左右除总数按钮以外的按钮对应的值，返回值情况参见描述，
     * 当没有指定索引但指定了值时返回null
     */
    value: function (index, value) {
      var i, seq, len, children, result;
      var hasTotal = (this.type === TYPE_CHECKBOX_FILTER && this.total === true);
      children = this.$children;
      len = children.length;
      if (index !== undefined) {
        if (typeof index === 'number') {
          if (hasTotal === true) {
            index++;
          }
          if (this._inRange(index)) {
            if (value === undefined) {
              return [children[index].value];
            } else if (typeof value === 'string') {
              children[index].value = value;
            }
          }
        } else if (Array.isArray(index) === true) {
          if (value === undefined) { // 返回给定索引对应的总数
            result = [];
            len = index.length;
            for (i = 0; i < len; i++) {
              seq = index[i];
              if (hasTotal === true) {
                seq++;
              }
              if (this._inRange(seq)) { // 序号不在范围内将被跳过
                result.push(children[seq].value);
              }
            }
            return result;
          } else if (Array.isArray(value) === true && index.length === value.length) {
            for (i = index.length - 1; i >= 0; i--) {
              seq = index[i];
              if (typeof seq === 'number' && typeof value[i] === 'string') {
                if (hasTotal === true) {
                  seq++;
                }
                if (this._inRange(seq)) { // 序号不在范围内将被跳过
                  children[seq].value = value[i];
                }
              } else {
                continue; // 非数值项将被跳过
              }
            }
          }
        }
      } else if (num === undefined) { // 返回所有值，总数按钮除外
        result = [];
        i = (hasTotal === true) ? 1 : 0;
        for (; i < len; i++) {
          result.push(children[i].value);
        }
        return result;
      }
      return null;
    }
  }
});

Vue.component('t-box-group', BoxGroup);

module.exports = BoxGroup;
</script>
