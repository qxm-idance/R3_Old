<template>
<div :class="prefixCls">
  <slot></slot>
</div>
</template>
<script>
export default {
  props: defaultProps({
    prefixCls: 't-collapse',
    activeKey: oneOfType([String, Array]),
    defaultActiveKey: oneOfType([String, Array]),
    onChange () {},
    accordion: false
  }),
  compiled () {
    let { activeKey, accordion, defaultActiveKey } = this;
    if (!accordion) {
      defaultActiveKey = defaultActiveKey || [];
    }
    this.activeKey = activeKey || defaultActiveKey;
  },
 
  ready () {
    this._mapPropsToChildComponent();
  },

  methods: {
    _mapPropsToChildComponent () {
      const activeKey = this._getActivityKey();
      const self = this;
      console.log(self);
      console.log(this.$options.props);
      const $children = this.$el.querySelectorAll('[role="tab"]');
      console.log($children);
      [...$children].forEach(($child, index) => {
        const child = $child.__vue__;
        // console.log(child);
        const key = child.key || index;
        const header = child.header;
        let isActive = false;
        if (self.accordion) {
          isActive = activeKey === key;
        } else {
          isActive = activeKey.indexOf(key) > -1;
        }
        child.prefixCls = self.prefixCls;
        child.isActive = isActive;
        child.onItemClick = self._handleClickItem.bind(this, key);
      });
    },

    _setChildAcitve () {
      const activeKey = this._getActivityKey();
      const self = this;
      const $children = this.$el.querySelectorAll('[role="tab"]');
      [...$children].forEach(($child, index) => {
        const child = $child.__vue__;
        console.log(child.header);
        const key = child.key || index;
        let isActive = false;
        if (self.accordion) {
          isActive = activeKey === key;
        } else {
          isActive = activeKey.indexOf(key) > -1;
        }
        child.isActive = isActive;
      });
    },

    _handleClickItem (key, e) {
      const activeKey = this._getActivityKey();

      if (this.accordion) {
        this.activeKey = key === activeKey ? null : key;
      } else {
        const index = activeKey.indexOf(key);
        const isActive = index > -1;

        if (isActive) activeKey.splice(index, 1);
        else activeKey.push(key);
        this.activeKey = activeKey;
      }
      this._setChildAcitve();
      this.onChange(key);
    },

    _getActivityKey () {
      let activeKey = this.activeKey;
      const accordion = this.accordion;

      if (accordion && Array.isArray(activeKey)) {
        activeKey = activeKey[0];
      }

      if (!accordion && !Array.isArray(activeKey)) {
        activeKey = activeKey ? [activeKey] : [];
      }

      return activeKey;
    }
  }
};

function oneOfType (validList, defaultValue) {
  let validaObj = {};
  validaObj.default = defaultValue;
  validaObj.validator = function (value) {
    if (value == null) return true;

    for (let j = 0; j < validList.length; j++) {
      const currentValid = validList[j];
      let validName;
      if (typeof currentValid === 'string') {
        validName = currentValid;
      } else {
        validName = currentValid.name;
      }
      if (toString.call(value).indexOf(validName) > -1) {
        return true;
      }
    }
    return false;
  };
  return validaObj;
}

function defaultProps (props) {
  for (const i in props) {
    if (props.hasOwnProperty(i)) {
      let defaultValue = props[i];

      // 支持String， Number等类型
      if (defaultValue && defaultValue.name && window[defaultValue.name] === defaultValue) {
        props[i] = {
          type: defaultValue,
          default: null
        };

        continue;
      }

      let type = toString.call(defaultValue).replace('[object ', '').replace(']', '');

      // 如果传进来的是vue的原生props对象的话
      if (type === 'Object') {
        if (defaultValue.type != null ||
            defaultValue.default != null ||
            defaultValue.validator != null ||
            defaultValue.twoWay != null ||
            defaultValue.required != null) {
          continue;
        }
      }

      // 支持 Object和Array的简洁声明方式
      if (type === 'Array' || type === 'Object') {
        props[i] = {
          type: window[type],
          default: function () {
            return defaultValue;
          }
        };
        continue;
      }

      props[i] = {
        type: window[type],
        default: defaultValue
      };
    }
  }
  return props;
}
</script>
<style>
.t-collapse {
    background-color: #fff;
    border-radius: 3px;
    border: 1px solid #d9d9d9;
}
.t-collapse > .t-collapse-item:first-child {
    border-top: none;
}
.t-collapse > .t-collapse-item {
    border-top: 1px solid #d9d9d9;
}
.t-collapse > .t-collapse-item > .t-collapse-header {
    height: 38px;
    line-height: 38px;
    padding-left: 32px;
    color: #666;
    cursor: pointer;
    position: relative;
    background-color: #f2f2f2;
}
.t-collapse > .t-collapse-item > .t-collapse-header .icon-arrow-down {
  vertical-align: middle;
}
.t-collapse-content {
    display: none;
    overflow: hidden;
    color: #666;
    padding: 0 16px;
    background-color: #fff;
}
.t-collapse-content-active {
    display: block;
}

.t-collapse-content > .t-collapse-content-box {
    padding-top: 16px;
    padding-bottom: 16px;
}
.t-collapse-header[aria-expanded=true] {border-bottom: 1px solid #d9d9d9}
</style>