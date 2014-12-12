<?php
require '../stdlib.php';

session_start();

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

	<progress min="0" max="100" value="0" class="hidden"></progress>

	<div id="output"></div>

	<form enctype="multipart/form-data" method="post" id="uploadMemo" action="upload.php">
		<fieldset>
			<legend>Add a Memo (Audio or Picture)</legend>
			<input type="file" class="custom-file-input" name="memo" accept="audio/*;capture=microphone">
		</fieldset>
		<fieldset>
			<legend>Tags</legend>
			<input type="text" name="tags"/>
		</fieldset>

		<button>Upload Memo</button>
	</form>

	<div id="progress"></div>

	<!--
	<hr/>
	<?php echo "Total Memos: $totalMemos | Tags: $totalTags <br/><br/>"; ?>
	-->

	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="jquery.form.min.js"></script>

	<script>
	$(document).ready(function() { 
		var progressBar = $('progress'),
		form = $('#uploadMemo'); 

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
		 		//alert('Upload successful'); // YOLO
		 		progressBar.hide();
		 		form.fadeIn('slow'); 
		 	}
		}
	});
	</script>
</body>
</html>
