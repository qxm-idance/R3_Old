<template>
  <div role="tab" :class="prefixCls + '-item'">
    <div
      v-el:header
      :class="prefixCls + '-header'"
      @click="_handleItemClick">
      <i class="arrow"></i>
      {{{header}}}
    </div>
    <div :class="contentCls collapse__target" role="tabpanel">
      <div :class="prefixCls + '-content-box'">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      key: String,
      prefixCls: String,
      header: String,
      isActive: {
        type: Boolean,
        default: false
      }
    },
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
        var classes = `${this.prefixCls}-content`;
        var activeClass = (this.isActive) ? 'collapse--closed' : '';
        return classes + ' ' + activeClass;
      }
    },

    methods: {
      _setAriaExpend (el, value) {
        el.setAttribute('aria-expanded', value);
      },
      _handleItemClick () {
        this.isActive = true;
      }
    }
  }
  </script>
  