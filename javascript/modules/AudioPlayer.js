(function (exports, Dispatcher) {
	"use strict";

	function AudioPlayer () {
		var _AudioPlayer = this; 

		this.el = document.createElement('audio'); 
		this.el.setAttribute('autoplay', true);
		this.el.setAttribute('preload', 'auto'); 
		this.el.setAttribute('controls', true); 

		this.browserSupport = this.el.canPlayType('audio/mpeg') !== "";

		if (!this.browserSupport) {
			Dispatcher.broadcast("audioFatalError", "Sorry. Your browser doesn't support the audio clips on this page.");
		}

		this.el.addEventListener('error', this.onAudioError);
		this.el.addEventListener('ended', this.onAudioEnded);  
		this.el.addEventListener("loadstart", this.onLoadStarted); 
		this.el.addEventListener('canplay', this.onCanPlay.bind(this)); 
		this.el.addEventListener('timeupdate', this.onLoadProgress.bind(this)); 
	}

	AudioPlayer.prototype.onCanPlay = function () {
		Dispatcher.broadcast('audioCanPlay', this.el);  
	};

	AudioPlayer.prototype.onLoadStarted = function () {
		Dispatcher.broadcast('audioLoadStarted'); 
	};

	AudioPlayer.prototype.onLoadProgress = function () {
  	//var progress = parseInt(((this.el.currentTime / this.el.duration) * 100), 10);
  	//Dispatcher.broadcast('audioLoadProgress', progress); 
	};

	AudioPlayer.prototype.onAudioError = function (err) {
		Dispatcher.broadcast('audioPlaybackError', err); 
	};

	AudioPlayer.prototype.onAudioEnded = function (err) {
		Dispatcher.broadcast('audioEnded', err); 
	};

	AudioPlayer.prototype.loadAudio = function (src) {
		if (!this.browserSupport) { return false; }
		this.el.setAttribute('src', src); 
		this.el.play(); 
	};

	exports.AudioPlayer = AudioPlayer; 

})(window, Dispatcher); 
