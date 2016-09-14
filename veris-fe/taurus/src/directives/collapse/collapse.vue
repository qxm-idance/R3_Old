<script>
  import Vue from 'vue';

  export default {
    twoWay: true,
    bind () {
    },
    update (value) {
      var el = this.el;
      this._setAriaExpend(el,value);
      this._setDisplay(el,value);
    },
    _setAriaExpend (el, value) {
      el.setAttribute('aria-expanded', value);
    },
    _setDisplay (el,value) {
      let style = document.createElement('style');
      let hei = el.offsetHeight;
      if(value){
        el.style.cssText = `display:block;`;
      }else{
        el.style.cssText = `display:none;`;
      }
    }
  }
</script>
