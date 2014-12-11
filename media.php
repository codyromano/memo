<?php

require_once 'stdlib.php';

if (isset($_GET['fileName'])) {
	$basename = basename($_GET['fileName']); 
	$filePath = DIR_MEMO_AUDIO . "/" . $basename;

	if (is_readable($filePath)) {
		$ext = pathinfo($basename, PATHINFO_EXTENSION);
		$contentType = '';

		switch ($ext) {
			case 'm4a': $contentType = 'audio/mp4'; break; 
			case 'jpg': $contentType = 'image/jpeg'; break;
			case 'jpeg': $contentType = 'image/jpeg'; break; 
		}

		header('Pragma: public');
		header('Cache-Control: max-age=86400');
		header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));

		if (!empty($contentType)) {
			header('Content-Type: ' . $contentType);
		} 
		header('Content-Disposition: inline; filename=' . $basename); 
		readfile($filePath); 
	} else {
		echo "Media '" . htmlentities(strip_tags($basename)) . "' not found";
	}
}


?>
