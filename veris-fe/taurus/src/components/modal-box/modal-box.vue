<template>
	<div class="modal-box__overlay  {{openClass}}" transition="modal">
	  <div class="modal-box__content gradient-line padding-whole--none {{sizeClass}}">
	    <div class="modal-box__close-btn icon icon-reject" @click="close"></div>
	      <div class="padding-whole"><slot></slot></div>     	
	  	</div>
	</div> 
</template>
<script>
	const SIZE_SMALL = 'small';
	const SIZE_LARGE = 'large';
	const CSS_SMALL = 'modal-box--size-small';
	const CSS_LARGE = 'modal-box--size-large';
	const CSS_IS_OPEN = 'modal-box--is-open';
	export default {
		props: {
			show : {
	      type: Boolean,
	      required: true,
	      twoWay: true    
	    },
	    size: {
				type:String
			}
		},
		computed: {
			sizeClass: function () {
				if (this.size === SIZE_LARGE) {
					return CSS_LARGE;
				}else{
					return CSS_SMALL;
				}
			},
			openClass: function () {
				if(this.show){
					this.$dispatch('modal-opend');
					return CSS_IS_OPEN;
				}else{
					return '';
				}
			}
		},
		methods: {
			close: function () {
				this.show = false;
				this.$dispatch('modal-closed');
			}
		}
	}
</script>

