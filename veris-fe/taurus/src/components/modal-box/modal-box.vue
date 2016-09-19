<template>
	<div class="modal-box__overlay  {{openClass}}" transition="modal" @click="overlayClose">
	  <div class="modal-box__content gradient-line padding-whole--none {{sizeClass}}" @click="stop">
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
				type: String
			},
			backdrop: {
				type: Boolean
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
			close: function (e) {
				this.show = false;
				this.$dispatch('modal-closed');
			},	
			overlayClose: function () {
				if(this.backdrop){
					this.close();
				}		
			},
			stop: function (evt) {
				evt = evt || window.event;
    			evt.stopPropagation ? evt.stopPropagation() : evt.cancelBubble = true;
			}
		},
		created: function () {
			console.log(this.backdrop);
		}
	}
</script>

