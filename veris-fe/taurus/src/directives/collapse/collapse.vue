<script>
  import Vue from 'vue';

  export default {
    twoWay: true,
    bind () {
    },
    update (value) {
      let el = this.el;
      this._setAriaExpend(el,value);
      this._setDisplay(el,value);
      this._toggleCss(el,value);
    },
    _setAriaExpend (el, value) {
      el.setAttribute('aria-expanded', value);
    },
    _setDisplay (el,value) {
      let style = document.createElement('style');
      if(value){
        el.style.cssText = `display:block;`;
      }else{
        el.style.cssText = `display:none;`;
      }
    },
    _toggleCss (el,value) {
      if(value){
        el.classList.add('collapse');
      }else{
        el.classList.remove('collapse');
      }
    }
  }
</script>
