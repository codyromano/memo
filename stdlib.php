<?php
date_default_timezone_set("EST");

define('PRODUCTION_ENV', strpos($_SERVER['HTTP_HOST'], 'codyromano') !== false);

$DOCROOT = $_SERVER['DOCUMENT_ROOT']; 

if (PRODUCTION_ENV) {
	define('DIR_MEMO_AUDIO', '/home4/codyroma/memos/');
	define('DIR_MEMO_TAGS', '/home4/codyroma/memo-tags/');
} else {
	define('DIR_MEMO_AUDIO', $DOCROOT . '/test-memos/');
	define('DIR_MEMO_TAGS', $DOCROOT . '/test-memo-tags/'); 
}

define('FILE_COMPRESSED_PREFIX', 'comp_'); 

define('FILENAME_SEPARATOR', '_'); 
define('TAG_SEPARATOR', ','); 

?>