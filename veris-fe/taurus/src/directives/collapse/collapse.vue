<script>
  import Vue from 'vue';
  import anim from 'css-animation';
  export default {
    twoWay: true,
    bind () {
      this.el.classList.add('collapse__target');
    },
    update (value) {
      let el = this.el;
      this._setAriaExpend(el,value);
      this._setDisplay(el,value);
    },
    _setAriaExpend (el, value) {
      el.setAttribute('aria-expanded', value);
    },
    _setDisplay (el, value) {
      var visibility = el.style.visibility;
      var position = el.style.position;
      el.style.cssText = `position:absolute;visibility:hidden;display:block;left:-9999px`;
      var hei = el.offsetHeight; 
      if (value) {  
        el.style.cssText = `display:block; height:0px; position:${position}; visibility:${visibility}`;
        setTimeout(function () {
          el.style.cssText = `transition: height .35s ease; height:${hei}px;`;
        },0); 
        setTimeout(function () {
          el.style.cssText = `display:block; height:${hei}px;`;
        },350);         
      } else {
        el.style.height = `${hei}px`;
        setTimeout(function () {
          el.style.cssText = `transition: height .35s ease; height:0px ; `;     
        },0); 
        setTimeout(function () {
          el.style.cssText = `display:none;height:0px`;
        }, 350);
      }
    }
  }
</script>
