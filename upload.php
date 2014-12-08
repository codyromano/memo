<?php
require 'stdlib.php';

define('FILENAME_SEPARATOR', '_'); 
session_start();

// Function to get the client IP address
function get_client_ip() {
    $ipaddress = '';
    if (getenv('HTTP_CLIENT_IP'))
        $ipaddress = getenv('HTTP_CLIENT_IP');
    else if(getenv('HTTP_X_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
    else if(getenv('HTTP_X_FORWARDED'))
        $ipaddress = getenv('HTTP_X_FORWARDED');
    else if(getenv('HTTP_FORWARDED_FOR'))
        $ipaddress = getenv('HTTP_FORWARDED_FOR');
    else if(getenv('HTTP_FORWARDED'))
       $ipaddress = getenv('HTTP_FORWARDED');
    else if(getenv('REMOTE_ADDR'))
        $ipaddress = getenv('REMOTE_ADDR');
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

try {

	if (!isset($_FILES) || !isset($_FILES['memo'])) {
		throw new Exception("No audio or photo uploaded"); 
	}

	if (!is_dir(DIR_MEMO_AUDIO) && !mkdir(DIR_MEMO_AUDIO)) {
		throw new Exception("Cannot create memos directory; check permissions."); 
	}

	$recordID = uniqid(); 

	$file = $_FILES['memo'];
	$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
	$fileName = "memo_" . get_client_ip() . "_" . time() . ".{$extension}";

	$fileName = "memo" . FILENAME_SEPARATOR . $recordID . FILENAME_SEPARATOR; 
	$fileName.= get_client_ip() . FILENAME_SEPARATOR . time() . ".{$extension}";

	if (!move_uploaded_file($file['tmp_name'], DIR_MEMO_AUDIO . $fileName)) {
		throw new Exception("Cannot move audio");
	}

	if (!empty($_POST['tags'])) {
		if (!is_dir(DIR_MEMO_TAGS) && !mkdir(DIR_MEMO_TAGS)) {
			throw new Exception("Cannot create memo tags directory; check permissions");
		}

		$fileName = "memo" . FILENAME_SEPARATOR . $recordID . FILENAME_SEPARATOR; 
		$fileName.= get_client_ip() . FILENAME_SEPARATOR . time() . ".txt";

		$fh = fopen(DIR_MEMO_TAGS . $fileName, 'wb'); 
		fwrite($fh, htmlentities(strip_tags($_POST['tags']))); 
		fclose($fh); 
	}

	echo "Upload successful";

} catch (Exception $e) {
	echo "Error: " . $e->getMessage();
}

?>