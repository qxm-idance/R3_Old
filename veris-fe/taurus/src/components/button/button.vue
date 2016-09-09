<template>
	<button class="button {{classes}}" :disabled="disabled" type="{{type}}" v-on:click="_onClick" 
		data-loading="{{state == 'loading'}}"
		data-loaded="{{state == 'loaded'}}"
		>
		<span class="button__label {{iconClass}}">{{text}}</span>
		<span class="button__label--success icon icon--left icon-thumb-up">Success</span>
		<span class="button__spinner">
			<span class="spinner-holder">
				<span class="spinner-container">
					<em><span></span></em>
				</span>
			</span>
		</span>
	</button>
</template>
<script>

const SIZE_SMALL = "small";
const SIZE_MICRO = "micro";
const CSS_SMALL = "button--small";
const CSS_MICRO = "button--micro";

export default {
	props: {
		text: String,
		type: {
			type: String,
			default: 'button'
		},
		useLoading: {
			type: [Boolean, String],
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		class: String,
		iconClass: String,
		size: String
	},
	data: function () {
		return {
			state: ''
		};
	},
	computed: {
		classes: function() {
			var classes = '';
			if(!!this.class) {
				classes += " " + this.class;
			}
			if(this.size === SIZE_SMALL) {
				classes += " " + CSS_SMALL
			}else if(this.size === SIZE_MICRO) {
				classes += " " + CSS_MICRO
			}

			return classes;
		}
	},
	methods: {
		activityIndicator: function (promise) {
			this._loading();
			promise.then(this._loadedWithSuccess, this._loadedWithError);
		},
		_onClick: function (e) {
			if(this.state == 'loading') {
				e.preventDefault();
				return false;
			}

			if (this.state == 'loaded') {
				this.$dispatch('loaded-click');
				e.preventDefault();
				return false;
			}

			if(this.useLoading) {
				this._loading();
			}

			// if ('submit' in this.$options) {
			// 	this.$el.closest('form').submit();
			// }

			/* Should be removed after switching to mobile shop. It is used for opening popups with external content (also should be refactored). */
			// else if (this.$options.eventname) {
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// 	this.$tools.dom.find(window.document).trigger(this.$options.eventname, [this.$el[0]]);
			// }
			/* End Remove */

			// else {
				this.$dispatch('btn-click');
			// }
		},
		_loading: function () {
			this.state = 'loading';
		},
		_loadedWithSuccess: function() {
			console.log("_loadedWithSuccess");
			this.state = 'loaded';
			this.$dispatch('action-finished');
		},
		_loadedWithError: function() {
			this.state = '';
			this.$dispatch('action-finished');
		}
	}
}

</script>

<style>
</style>