(function (exports, Dispatcher) {

	function ImageGallery () {
		this.el = document.createElement('img');
		this.images = []; 
		this.currentImage = 0; 
		this.durationPerImage = 500; 
		this.started = false; 

		this.debugStats = {
			timeLastImageShown: null
		};
	}

	ImageGallery.prototype.preloadImage = function (src, callback) {
		var image = new Image(); 
		image.onload = callback; 
		image.src = src; 
	};

	ImageGallery.prototype.resetImages = function () {
		this.images = []; 
	};

	ImageGallery.prototype.addImage = function (src) {
		var _ImageGallery = this; 

		if (this.images.indexOf(src) > -1) {
			console.warn('Image ', src, ' already added to slideshow');
			return false; 
		}

		this.preloadImage(src, function () {
			_ImageGallery.images.push(src); 
		});
	};

	ImageGallery.prototype.showNextImage = function (src) { 
		var timeDiff; 

		var _ImageGallery = this; 
		var nextImage = this.images[this.currentImage + 1]; 
		var callShowNextImageAgain = function () {
			/* There should not be simultaneous pending requests to call 
			* 'showNextImage' recursively. This check ensures that 
			* there can be only one */
			if (typeof _ImageGallery.scheduledTimeout === 'number') {
				window.clearTimeout(_ImageGallery.scheduledTimeout); 
			}
			_ImageGallery.scheduledTimeout = window.setTimeout(
				_ImageGallery.showNextImage.bind(_ImageGallery),
				_ImageGallery.durationPerImage
			);
		};

		if (typeof this.debugStats.timeLastImageShown === 'number') {
			timeDiff = new Date().getTime() - this.debugStats.timeLastImageShown;
			//console.log('td: ', timeDiff, ' src: ', nextImage); 
		}

		this.debugStats.timeLastImageShown = new Date().getTime(); 

		// Show the next image in the array if it exists
		if (nextImage) {
			this.showImage(nextImage, callShowNextImageAgain); 
			++this.currentImage;

			/* If we've reached the end of the array, go back to 
			* the first image. But if there's only one image, 
			* do nothing; no change is necessary */
		} else if (this.images.length > 1) {
			this.currentImage = 0; 
			this.showImage(this.images[0], callShowNextImageAgain); 
		}
	};

	ImageGallery.prototype.startSlideshow = function () {
		var firstImage = this.images[this.currentImage];

		if (this.started) { 
			console.warn('Slideshow is already running');
			return false; 
		}
		if (firstImage) {
			this.started = true;
			Dispatcher.broadcast('showedFirstImage'); 
			this.showImage(firstImage); 
			window.setTimeout(this.showNextImage.bind(this), this.durationPerImage);
		} else {
      		window.setTimeout(this.startSlideshow.bind(this), 250); 
    	}
	};

	ImageGallery.prototype.showImage = function (src, callback) {
		console.log('showing ', src);
		callback = typeof callback === 'function' ? callback : function () {};
		this.el.style['background-image'] = "url('" + src + "')";
		callback();
	};

  exports.ImageGallery = ImageGallery; 

})(window, Dispatcher);
