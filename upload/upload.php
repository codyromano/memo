<?php
require '../stdlib.php';

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

/**
* Copied from http://stackoverflow.com/questions/12661/efficient-jpeg-image-resizing-in-php 
*/
function makeThumbnail ($sourcefile, $endfile, $thumbwidth, $thumbheight, $quality) {
	// Load image and get image size.
	$img = imagecreatefromjpeg($sourcefile);
	$width = imagesx( $img );
	$height = imagesy( $img );

	if ($width > $height) {
	    $newwidth = $thumbwidth;
	    $divisor = $width / $thumbwidth;
	    $newheight = floor( $height / $divisor);
	}
	else {
	    $newheight = $thumbheight;
	    $divisor = $height / $thumbheight;
	    $newwidth = floor( $width / $divisor );
	}

	// Create a new temporary image.
	$tmpimg = imagecreatetruecolor( $newwidth, $newheight );

	// Copy and resize old image into new image.
	imagecopyresampled( $tmpimg, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height );

	// Save thumbnail into a file.
	imagejpeg( $tmpimg, $endfile, $quality);

	// release the memory
	imagedestroy($tmpimg);
	imagedestroy($img);
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
		throw new Exception("Cannot move audio or photo");
	}

	// TODO: Add thumbnail support for other file formats 
	if ($extension === 'jpg' || $extension === 'jpeg') {
		$maxImageWidth = 1000; 
		$sourceFile = DIR_MEMO_AUDIO . $fileName; 
		list($width, $height, $type, $attr) = getimagesize($sourceFile);

		if ($width > $maxImageWidth) {
			$thumbFile = DIR_MEMO_AUDIO . FILE_COMPRESSED_PREFIX . $fileName; 
			$thumbWidth = $maxImageWidth;
			//$thumbWidth = 500; 
			$thumbHeight = $height;
			$quality = 85; 

			makeThumbnail($sourceFile, $thumbFile, $thumbWidth, $thumbHeight, $quality); 
		}
	}

	$mediaFileName = $fileName;
	$mediaFileExt = $extension;

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

	echo "Finished uploading <a href='../media.php?fileName=" . $mediaFileName . "'>your .$mediaFileExt file</a> at " . date("g:i:s a") . "</a>";

} catch (Exception $e) {
	echo PRODUCTION_ENV ? "Whoops. An error occurred. Please give it another go." : $e->getMessage();
}

?>