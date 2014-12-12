(function (exports) {
	"use strict";

	var dateRegex, 
	slideshowIndex,  
	allMedia = exports.allMedia,
	featuredAudio,
	mediaURIPrefix = getMediaURIPrefix(), 
	header1, 
	header2,
	loader, 
	status, 
	hideStatusTimeout,
	imageGallery;

	// Start a slideshow of related images
	imageGallery = new ImageGallery(); 
	imageGallery.el = el('#featuredImage'); 
	imageGallery.durationPerImage = 8000; 

	// Extract just the date from the "humanTime" string
	// in the server's response 
	dateRegex = /[a-zA-Z]+\s[0-9]{1,2},\s[0-9]{4}/; 

	header1 = el('h1');
	header2 = el('h2');
	status = el('#status');
	loader = el('#loader');
	featuredAudio = el('#featuredAudio'); 

	function init () {
		getMediaRecords(function (media) {
			var audio = media.filter(isAudio),
			images = media.filter(isImage);

			Dispatcher.listen('showedFirstImage', function () {
				loader.classList.add('hidden');
			});

			featuredAudio.addEventListener('error', function (e) {
				showAudioErrorMessage(e);
				// Move on to the next audio clip 
				audio.shift();
				playSlideshow(audio, images);
			});

			// Start playing the audio clip 
			featuredAudio.addEventListener('ended', function () {
				// Move on to the next audio clip 
				audio.shift();
				playSlideshow(audio, images);
			});

			playSlideshow(audio, images); 
		});
	}

	init();

	function showAudioErrorMessage (e) {
		/* Adapted from: 
		http://stackoverflow.com/questions/13614803/how-to-check-if-html5-audio-has-reached-different-errors */
		 switch (e.target.error.code) {
		   case e.target.error.MEDIA_ERR_NETWORK:
		     console.error('A network error caused the audio download to fail.');
		     break;
		   case e.target.error.MEDIA_ERR_DECODE:
		     console.error('The audio playback was aborted due to a corruption problem or ' +
		     ' because the video used features your browser did not support.');
		     break;
		   case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
		     console.error('Sorry, the audio could not be loaded, either because the server or ' + 
		     	'network failed or because the format is not supported.');
		     break;
		   default:
		     console.error('Sorry, an unknown audio-related error occurred.');
		     break;
		 }
	}

	function el (domQuery) {
		return document.querySelector(domQuery); 
	}

	function getBaseDomain () {
		return document.domain === 'codyromano.com' ? 
			'/memo/' : 'http://www.codyromano.com/memo/';
	}

	function getMediaURIPrefix () {
		return getBaseDomain() + 'uploads/'; 
	} 

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

		featuredAudio.src = mediaURIPrefix + currentAudio.basename;
		//featuredAudio.play();

		header1.innerHTML = currentAudio.humanTime; 

		sharesTagFilter = hasAtLeastOneTag.bind(null, currentAudio.tags);
		relatedImages = imageFiles.filter(sharesTagFilter);

		imageGallery.resetImages();

		relatedImages.forEach(function (image) {
			imageGallery.addImage(mediaURIPrefix + image.basename); 
		});

		imageGallery.startSlideshow();
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

	function getTagsInURL () {
		var result = [],
		url = window.location.href,
		urlParts, startPos, i;

		if (url[url.length - 1] === '/') {
			url = url.slice(0, -1);
		} 

		urlParts = url.split('/');
		startPos = urlParts.indexOf('about');

		if (startPos > -1 && urlParts.length > startPos) {
			for (i = startPos + 1; i < urlParts.length; i++) {
				result.push(urlParts[i]);
			} 
		}
		return result; 
	}

	function getMediaRecords (cb) {
		var request = new XMLHttpRequest(),
		endpoint = getBaseDomain() + 'dump_json.php',
		tags = getTagsInURL();

		if (tags) {
			endpoint+= '?tags=' + tags.join(',');
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
