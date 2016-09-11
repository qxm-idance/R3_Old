<template>
<div role="tab" :class="prefixCls + '-item'">
  <div
    v-el:header
    :class="prefixCls + '-header'"
    @click="_handleItemClick">
    <i class="arrow"></i>
    {{header}}
  </div>
  <div
    :class="contentCls"
    role="tabpanel">
    <div :class="prefixCls + '-content-box'">
      <slot></slot>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: defaultProps({
    key: oneOfType([String, Number]),
    prefixCls: 'ant-collapse',
    // openAnimation: Object,
    header: oneOfType([String, Number]),
    isActive: false,
    onItemClick () {}
  }),

  // components: { Animate },

  ready () {
    this._setAriaExpend(this.$els.header, this.isActive);
  },

  watch: {
    isActive (value) {
      this._setAriaExpend(this.$els.header, value);
    }
  },

  computed: {
    contentCls () {
      var cls = 'ant-collapse-content';
      return (this.isActive ? cls + 'ant-collapse-content-active' : cls);
    }
  },

  methods: {
    _setAriaExpend (el, value) {
      el.setAttribute('aria-expanded', value);
    },
    _handleItemClick () {
      this.onItemClick();
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

