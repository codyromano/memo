<?php

require_once 'stdlib.php';

if (isset($_GET['fileName'])) {
	$basename = $_GET['fileName'];
	$filePath = DIR_MEMO_AUDIO . "/" . $basename;

	if (is_readable($filePath)) {
		readfile($filePath); 
	} else {
		echo "Media '" . htmlentities(strip_tags($basename)) . "' not found";
	}
}

?>