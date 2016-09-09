var _apiReady = null;

var SELECTORS = {
	playerHolder: '[data-selector="playerHolder"]'
};

var CLASSES = {
	active: 'ytplayer-active',
	flex: 'ytplayer-video--flex'
};

window.onYouTubeIframeAPIReady = function(){
	_apiReady.resolve();
}

/**
name: video
type: ui
desc: |
	Component for video (Youtube player) control with/without clickable cover image.
	
	If cover image is populated player will be initialized on first click on the cover
    otherwise player will be initialized on API loading.
    Player hase the same size as the cover image. 
    USE width and height option to override size.

options:
    youtubeId: String. Identifier of the youtube video
    width: player width
    height: player height

*/
module.exports = {
	events: {
		"click $cover": "onCoverClick",
		"click $closeBtn": "onClose"
	},

	initialize: function(){
		this.player = null;
		this.$playerHolder = this.$el.find(SELECTORS.playerHolder);

		if(!this.$options.hasCover && !+this.$options.width && !+this.$options.height)
		{
			this.$playerHolder.addClass(CLASSES.flex);
		}

		if(!_apiReady){
			_apiReady = this.$tools.q.defer();
		}
	},

	ready: function(){
		_apiReady.then(this.onApiReady.bind(this));
	},

	_initPlayer: function(){
		var _width = this.$options.width || this.$el.width();
		var _height = this.$options.height || this.$el.height();

		this.player = new YT.Player(this.$options.youtubeId, {
			width: _width,
			height: _height,
			videoId: this.$options.youtubeId,
			playerVars: {
				modestbranding: 1,
				showinfo: 0,
				controls: 1
			},
			events: {
				onReady: this.onPlayerReady.bind(this)
			}
		});
	},

	_play: function(){
		
		if(!_apiReady.state() === 'resolved'){
			return;
		}

		if(this.player){
			this.$el.addClass(CLASSES.active);
			this.player.playVideo();
		}
		else {
			this._initPlayer();
		}
	},

	onPlayerReady: function(){
		if(this.$options.hasCover){
			this._play();
		}
	},

	onApiReady: function(){
		if(!this.$options.hasCover){
			this._initPlayer();
		}
	},

	onCoverClick: function(){
		this._play();
	},

	onClose: function(e){
		e.preventDefault();
		
		this.$el.removeClass(CLASSES.active);
		this.player.pauseVideo();
	}
}
