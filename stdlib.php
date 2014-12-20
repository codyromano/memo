<?php

date_default_timezone_set("EST");

define('PRODUCTION_ENV', strpos($_SERVER['HTTP_HOST'], 'codyromano') !== false);

$DOCROOT = $_SERVER['DOCUMENT_ROOT']; 

if (PRODUCTION_ENV) {
	define('DIR_MEMO_AUDIO', '/home4/codyroma/memos/');
	define('DIR_MEMO_TAGS', '/home4/codyroma/memo-tags/');
	define('DIR_MEMO_PUBLIC', '/home4/codyroma/public_html/memo/');
} else {
	define('DIR_MEMO_AUDIO', $DOCROOT . '/test-memos/');
	define('DIR_MEMO_TAGS', $DOCROOT . '/test-memo-tags/');
	define('DIR_MEMO_PUBLIC', $_SERVER['DOCUMENT_ROOT'] . '/memo/');  
}

define('FILE_COMPRESSED_PREFIX', 'comp_'); 
define('MEMO_FILENAME_SEPARATOR', '_'); 
define('TAG_SEPARATOR', ','); 
define('CONFIG_FILE', 'config.php'); 

/*
if (!file_exists(DIR_MEMO_PUBLIC . CONFIG_FILE)) {
	exit('Please change the values in ' . CONFIG_FILE . '.txt and rename it to ' . CONFIG_FILE); 
}
*/
require_once DIR_MEMO_PUBLIC . CONFIG_FILE; 


?>