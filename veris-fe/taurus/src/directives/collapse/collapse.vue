<script>
  import Vue from 'vue';
  export default {
    twoWay: true,
    bind () {
      this.el.classList.add('collapse__target');
    },
    update (value) {
      let el = this.el;
      this._setAriaExpend(el, value);
      this._setDisplay(el, value);
    },
    _setAriaExpend (el, value) {
      el.setAttribute('aria-expanded', value);
    },
    _setDisplay (el, value) {
      el.classList.add('collapsing');
      if (typeof window.screenX === 'number') {
        var height = 0;
        Array.prototype.slice.call(el.childNodes).forEach(function (child) {
          if (child.nodeType === 1) {
            var oStyle = window.getComputedStyle(child);
            height = child.clientHeight + (parseInt(oStyle.borderTopWidth) || 0) + (parseInt(oStyle.borderBottomWidth) || 0);
          }
        });
      }
      el.style.height = value ? `${height}px` : '0px';
      if (value) {
        el.classList.contains('collapse--closed') && el.classList.remove('collapse--closed');
      }
      setTimeout(function () {
        el.classList.remove('collapsing');
        if (!value) {
          el.classList.add('collapse--closed');
        }
      }, 1000);
    }
  }
</script>
