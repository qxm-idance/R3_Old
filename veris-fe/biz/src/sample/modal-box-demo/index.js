import Vue from 'vue';
import ModalBox from 'taurus/components/modal-box/modal-box';
import Button from 'taurus/components/button/button';
new Vue({
  el: '#defaultModal',
  components: {
    't-modal-box': ModalBox
  },
  data: {
    showModal: false,
    sizeModal: 'large'
  },
  events: {
    'modal-opend': function () {
      console.log('modal-box is opend');
    },
    'modal-closed': function () {
      console.log('modal-box is closed');
    }
  }
});

new Vue({
  el: '#actionButtonModal',
  components: {
    't-modal-box': ModalBox,
    't-button': Button
  },
  data: {
    showActionModal: false,
    sizeModal: 'large'
  },
  methods: {
    close: function () {
      // 通过子组件的props里面的属性来关闭
      this.showActionModal = false;
    },
    onOk: function () {
      this.close();
    },
    onCancel: function () {
      // 通过v-ref通信来访问子组件的方法
      this.$refs.modal.close();
    }
  },
  events: {
    'modal-opend': function () {
      console.log('modal-box is opend');
    },
    'modal-closed': function () {
      console.log('modal-box is closed');
    }
  }
});

