<script>
  import Vue from 'vue';

  export default {
    twoWay: true,
    bind () {
      this.el.classList.add('collapsing');
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
    _setDisplay (el, value) {
      var style = document.createElement('style');
      var hei = el.offsetHeight;
      var originalHeight = el.offsetHeight;
      if (value) {
        el.style.cssText = `display:block; height:0px `;
        setTimeout(function () {
          el.style.cssText = `height:0px ; transition: height .35s ease; height:329px;`;
        },0);        
      } else {
        el.style.height = `329px`;
        el.style.cssText = `transition: height .35s ease; height:0; overflow:hidden;`;
        console.log(originalHeight);
        setTimeout(function () {
          el.style.cssText = `display:none; height:0px`;
        }, 350);
        console.log(originalHeight);
      }
    },
    _toggleCss (el, value) {
      if (value) {
        el.classList.add('collapse');
      } else {
        el.classList.remove('collapse');
      }
    },
    _animtion(el, value) {

    }
  }
</script>
