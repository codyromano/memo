<?php
require '../stdlib.php';

session_start();

if (isset($_GET['autoTag'])) {
	$_SESSION['autoTag'] = htmlentities($_GET['autoTag']);
}

if (isset($_GET['unsetAutoTag'], $_SESSION['autoTag'])) {
	unset($_SESSION['autoTag']); 
}

function getTotalFiles ($dir) {
	$dirContents = scandir($dir); 
	return count($dirContents) - 2; // Don't count the '.' or '..'
}

$totalMemos = getTotalFiles(DIR_MEMO_AUDIO); 
$totalTags = getTotalFiles(DIR_MEMO_TAGS); 

?><!doctype>
<html>
<head>
	<title>Memo Uploader</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="main.css" type="text/css"/>

</head>
<body>

<main>

	<progress min="0" max="100" value="0" class="hidden"></progress>

	<h3 class="success">Success!</h3>
	<div id="output"></div>
	<a class="actionBtn success" id="continue">Continue</a>

	<form enctype="multipart/form-data" method="post" id="uploadMemo" action="upload.php">
		<fieldset class="uploadButtonWrapper">
			<span class="actionBtn" id="fileName"><b>Pick a photo</b>
			<input type="file" name="memo" id="fileUpload"/></span>
		</fieldset>

		<fieldset class="uploadButtonWrapper hidden" id="tagsWrapper">
			<legend>Now enter at least one keyword to describe the file you're uploading.</legend>
			<input type="text" name="tags" placeholder="E.g. christmas,family"/>
		</fieldset>

		<a class="actionBtn bigAction hidden" id="submitMemo"><b>Upload</b></a> 
	</form>

	<div id="progress"></div>


</main>

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.form.min.js"></script>

	<script>

	function simpleBasename (filePath) {
		var lastSlash = filePath.lastIndexOf('/'); 
		if (lastSlash === -1 && (lastSlash = filePath.lastIndexOf('\\')) === -1) {
			console.error("Invalid base name"); 
			return false; 
		}
		return filePath.substring(lastSlash + 1); 
	}

	$(document).ready(function() { 
		"use strict";

		// Warning: this is some ugly spaghetti code; 
		// just need to get this out for a personal project

		var progressBar = $('progress'),
		form = $('#uploadMemo'),
		$fileUpload = $("#fileUpload"),
		$fileName = $("#fileName b"),
		$tagsWrapper = $("#tagsWrapper"),
		$tagInput = $("input[name=tags]"),
		$submitBtn = $("#submitMemo"),
		$success = $(".success"),
		$cont = $("#continue"),
		$output = $("#output"),
		fileNameText,

		// Terrible, I know
		autoTag = "<?php if (isset($_SESSION['autoTag'])) { echo $_SESSION['autoTag'];} ?>"; 

		$cont.click(function () {
			$output.text(''); 
			$success.fadeOut('fast');
			$tagsWrapper.fadeOut('fast'); 
			$tagInput.removeClass('focusTags'); 
			$fileName.parent().removeClass('fileSelected');  
			$submitBtn.fadeOut('fast'); 

			window.setTimeout(function () { 
				form.fadeIn('slow');
			}, 800);  
		});

		$submitBtn.click(function () {
			form.submit(); 
		});

		$fileUpload.change(function () {
			fileNameText = $fileUpload.val(); 
			var basename = simpleBasename(fileNameText);

			if (typeof basename === 'string' && basename.length > 0) {
				//$fileName.text(basename).parent().addClass('fileSelected');
				$fileName.parent().addClass('fileSelected');

				if (autoTag.length > 0) {
					$tagInput.val(autoTag); 
					form.submit(); 
				} else {
					$tagsWrapper.fadeIn('slow');
					$tagInput.addClass('focusTags').focus();
				} 
			}
		});

		$tagInput.keyup(function () {
			if ($tagInput.val().length > 0) {
				$submitBtn.fadeIn("slow"); 
			} else {
				$submitBtn.fadeOut("slow"); 
			}
		});

		var options = { 
		    target:   '#output',   // target element(s) to be updated with server response 
		    beforeSubmit:  beforeSubmit,  // pre-submit callback 
		    success:       afterSuccess,  // post-submit callback 
		    uploadProgress: OnProgress, //upload progress callback 
		    resetForm: true        // reset the form after successful submit 
		}; 
		        
		 form.submit(function() { 
		    form.ajaxSubmit(options);
		    form.fadeOut('slow');            
		    return false; 
		}); 

		 function beforeSubmit () {}
		 function afterSuccess () {
		 } 

		 function OnProgress(event, position, total, percentComplete) {
		 	progressBar.show();
		 	progressBar.attr('value', percentComplete); 

		 	if (percentComplete == 100) {
		 		progressBar.hide();
		 		$success.fadeIn("slow"); 
		 		//form.fadeIn('slow'); 
		 	}
		}
	});
	</script>
</body>
</html>
