<?php
require 'stdlib.php';
header('Access-Control-Allow-Origin: *');  

function getFiles ($dirName) {
	$contents = scandir($dirName); 
	array_shift($contents); # remove '.'
	array_shift($contents); # remove '..'
	return $contents;
}

# Return a list of files in the photo / audio directory
function getMediaFiles () {
	return getFiles(DIR_MEMO_AUDIO); 
}

# Return a list of files in the Tags directory
function getTagFiles () {
	return getFiles(DIR_MEMO_TAGS); 
}

function getTagsByFileName ($tagFileName) {
	$tags = array(); 

	if (is_readable($tagFileName)) {
		$tagFileContents = file_get_contents($tagFileName);

		// Remove consecutive spaces
		$tagFileContents = str_replace('  ', ' ', $tagFileContents);
		$tags = explode(TAG_SEPARATOR, $tagFileContents); 
	}

	$tags = array_map('strtolower', $tags);
	return $tags;
}

function parseFileName ($fileName) {
	$parts = explode(MEMO_FILENAME_SEPARATOR, $fileName);
	$ext = pathinfo($fileName, PATHINFO_EXTENSION);
	
	$timestamp = (int) str_replace($ext, "", $parts[3]);

	return array(
		"id" => $parts[1], 
		"basename" => $fileName,
		//"authorIp" => $parts[2], 
		"timestamp" => $timestamp,
		"humanTime" => date("F d, Y g:i a", $timestamp),
		"extension" => $ext,
		"tags" => array()
	);
}

$result = array(); 
$tags = getTagFiles();
$tagsHashTable = array(); 


function hasTags ($mediaItem) {
	$urlTags = explode(TAG_SEPARATOR, $_GET['tags']); 

	foreach ($urlTags as $urlTag) {
		if (!in_array($urlTag, $mediaItem['tags'])) {
			return false;
		}
	}
	return true; 
}

foreach ($tags as $tagFileName) {
	$tagRecord = parseFileName($tagFileName); 
	$tagsHashTable[$tagRecord['id']] = $tagRecord;
}

$media = getMediaFiles(); 

$urlTags = array();
if (isset($_GET['tags'])) {
	$urlTags = explode(TAG_SEPARATOR, $_GET['tags']); 
}

foreach ($media as $mediaFileName) {
	$mediaRecord = parseFileName($mediaFileName);  

	if (isset($tagsHashTable[$mediaRecord['id']])) {
		$tags = $tagsHashTable[$mediaRecord['id']];
		$mediaRecord['tags'] = getTagsByFileName(DIR_MEMO_TAGS . $tags['basename']); 
	}

	$tagsMatch = true;

	foreach ($urlTags as $urlTag) {
		if (!in_array($urlTag, $mediaRecord['tags'])) {
			$tagsMatch = false;
		}
	}

	if ($tagsMatch) {
		$result[] = $mediaRecord; 
	}
}

// When the quality flag is provided and set to compressed, try to retrieve
// compressed versions of different images 
$getCompressed = isset($_GET['quality']) && $_GET['quality'] === 'compressed';

if ($getCompressed) {
	foreach ($result as $key => $mediaItem) {
		$compressedFilename = DIR_MEMO_AUDIO . FILE_COMPRESSED_PREFIX . $mediaItem['basename'];

		if (file_exists($compressedFilename)) {
			$result[$key]['basename'] = FILE_COMPRESSED_PREFIX . $mediaItem['basename'];
		}
	}
}

echo json_encode($result); 
?>
