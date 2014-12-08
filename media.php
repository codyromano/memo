<?php

require_once 'stdlib.php';

if (isset($_GET['fileName'])) {
	$filePath = DIR_MEMO_AUDIO . "/" . basename($_GET['fileName']); 

	if (is_readable($filePath)) {
		readfile($filePath); 
	}
}

?>