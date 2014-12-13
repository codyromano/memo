(function (exports) {
	"use strict";

	var dateRegex, 
	featuredAudio, // TODO: Audio should be its own module 
	mediaURIPrefix = getMediaURIPrefix(), 
	header1, 
	header2,
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
	featuredAudio = el('#featuredAudio');

  function isMobileUser () {
    var check = false;
    (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|android|ipad|playbook|silk|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

	function init () {
    if (isMobileUser()) {
      getQualityPreference();
    } else {
      startStory();
    }
	}

	init();

  function startStory () {
    Loader.show(); 

    getMediaRecords(function (media) {
      var audio = media.filter(isAudio),
      images = media.filter(isImage);

      Dispatcher.listen('showedFirstImage', function () {
        Loader.hide(); 
      });

      featuredAudio.classList.remove('hidden'); 

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

  function getQualityPreference () {
    // Get DOM references to settings field
    var settingDiv = el('#qualitySetting'),
    qualityLinks = [].slice.call(settingDiv.querySelectorAll('a'));

    // Show the settings area and listen for selections 
    settingDiv.classList.remove('hidden'); 

    function continueToStory (qualitySetting) {
      // Remember the user's selection and start the story
      User.settings.imageQuality = qualitySetting; 
      settingDiv.classList.add('hidden'); 
      startStory(); 
    }

    qualityLinks.forEach(function (a) {
      a.addEventListener('click', 
        continueToStory.bind(null, a.dataset.imageQualitySetting), false
      );
    });
  }

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
			//loader.classList.add('hidden');
      Loader.show();
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
		endpoint = getBaseDomain() + 'dump_json.php?',
		tags = getTagsInURL();

		if (tags) {
			endpoint+= 'tags=' + tags.join(',') + '&';
		}

    if (User.settings.imageQuality === 'compressed') {
      endpoint+= 'quality=compressed';
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
