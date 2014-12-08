(function (exports) {
	"use strict";

	var dateRegex, 
	slideshowIndex, 
	featuredImage, 
	allMedia = exports.allMedia,
	mediaURIPrefix = getMediaURIPrefix(), header1, header2,
	loader, status, hideStatusTimeout;

	// Extract just the date from the "humanTime" string
	// in the server's response 
	dateRegex = /[a-zA-Z]+\s[0-9]{1,2},\s[0-9]{4}/; 
	featuredImage = document.querySelector('#featuredImage');
	header1 = document.querySelector('h1');
	header2 = document.querySelector('h2');
	status = document.querySelector('#status');
	loader = document.querySelector('#loader');

	function getBaseDomain () {
		return document.domain === 'codyromano.com' ? 
			'' : 'http://www.codyromano.com/memo/';
	}

	function getMediaURIPrefix () {
		return getBaseDomain() + 'media.php?fileName=';
	}

	function updateStatus (msg) {
		if (typeof hideStatusTimeout === 'number') {
			clearTimeout(hideStatusTimeout); 
		}
		status.innerHTML = msg;
		status.classList.remove('hidden');
		hideStatusTimeout = setTimeout(hideStatus, 4000); 
	}

	function hideStatus () {
		status.classList.add('hidden');
	}

	function init () {
		getMediaRecords(function (media) {
			var audio, images;

			exports.allMedia = allMedia = media; 
			audio = allMedia.filter(isAudio); 
			images = allMedia.filter(isImage);

			playSlideshow(audio, images); 
		});
	}

	init(); 

	function playSlideshow (audioFiles, imageFiles) {
		var currentAudio, 
		relatedImages, 
		sharesTagFilter, 
		srcArray,
		audio;

		if (!(currentAudio = audioFiles[0])) {
			console.log('No more audio');
			loader.classList.add('hidden');
			header1.innerHTML = 'End of audio content';
			return; 
		}

		loader.classList.remove('hidden'); 

		header1.innerHTML = currentAudio.humanTime; 

		audio = document.createElement('audio');
		audio.addEventListener('ended', function () {
			// Move on to the next audio clip 
			audioFiles.shift();
			playSlideshow(audioFiles, imageFiles); 
		});

		audio.addEventListener('playing', function () {
			updateStatus('Playing audio'); 
		});

		sharesTagFilter = hasAtLeastOneTag.bind(null, currentAudio.tags);
		relatedImages = imageFiles.filter(sharesTagFilter);

		// If there are no related images, just play the audio. The 
		// audio ended event listener will continue playback
		if (!relatedImages.length) {
			updateStatus('Loading audio'); 
			//header2.innerHTML+= 'No related images';
			audio.src = mediaURIPrefix + currentAudio.basename;
			audio.play();
			return;
		}

		relatedImages = sortRelatedImagesByTime(currentAudio, relatedImages);
		srcArray = relatedImages.map(function (image) {
			return mediaURIPrefix + image.basename;
		});

		updateStatus('Finding images that relate to the audio'); 

		loadImages(srcArray, function () {

			loader.classList.add('hidden');

			updateStatus('Loading audio'); 

			// Finished preloading images
			audio.src = mediaURIPrefix + currentAudio.basename;
			audio.play();

			(function cycleImages () {
				showImage(mediaURIPrefix + relatedImages[0].basename);

				if (relatedImages[1]) {
					relatedImages.shift();
					setTimeout(cycleImages, 6000); 
				}
			})();
		});	
	}

	function loadImages (srcArray, cb) {
		var total = srcArray.length,
		totalLoaded = 0; 

		srcArray.forEach(function (src, i) {

			updateStatus('Loading image ' + (i + 1) + ' of ' + total); 

			loadImage(src, function () {
				if (++totalLoaded === total) {
					cb(); 
				}
				updateStatus('Loaded image ' + totalLoaded + ' of ' + total); 
			});
		});
	}

	// Find all the images that share tags with a given 
	// audio file, assigning priority to those that occurred
	// in close proximity to the audio
	function sortRelatedImagesByTime (audioFile, imagesWithSharedTags) {
		var sortedByTimeDiff = {}, result = [];

		imagesWithSharedTags.forEach(function (image) {
			sortedByTimeDiff[Math.abs(image.timestamp - audioFile.timestamp)] = image; 
		});

		Object.keys(sortedByTimeDiff).forEach(function (key) {
			result.push(sortedByTimeDiff[key]);
		});

		return result; 
	}

	function loadAudio (src, cb) {
		var audio = document.createElement('audio');
		audio.onload = cb.bind(null, audio);
		audio.src = src;  
	}

	function loadImage (src, cb) {
		var image = document.createElement('img'); 
		image.onload = cb.bind(null, image); 
		image.src = src; 
	}

	function showImage (src) {
		//updateStatus('Displaying new image'); 
		loadImage(src, function () {
			featuredImage.style['background-image'] = "url('" + src + "')"; 
		}); 
	}

	function getMediaRecords (cb) {
		var request = new XMLHttpRequest(),
		endpoint = getBaseDomain() + 'dump_json.php',
		tags = getURLParameter('tags'); 

		if (tags) {
			endpoint+= '?tags=' + tags;
		}

		request.open('GET', endpoint, true);
		request.onload = function (event) {
			var result = JSON.parse(event.currentTarget.response); 
			cb(result); 
		};
		request.send();
	}

	function getURLParameter(name) {
  	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
      .exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	}

	function hasAtLeastOneTag (tags, mediaItem) {
		return tags.filter(function (tag) {
			return mediaItem.tags.indexOf(tag) > -1;
		}).length > 0;
	}

	function isAudio (mediaItem) {
		return mediaItem.extension && 
			['m4a','3pg'].indexOf(mediaItem.extension.toLowerCase()) > -1; 
	}

	function isImage (mediaItem) {
		return mediaItem.extension && 
			['jpg','jpeg','gif','png'].indexOf(mediaItem.extension.toLowerCase()) > -1;
	}

})(window);
