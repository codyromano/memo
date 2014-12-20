<?php
require_once 'stdlib.php';

try {
  if (!isset($_GET['fileName'])) {
    throw new Exception("You must provide a file."); 
  }
  $fileName = $_GET['fileName'];
  $fullPath = DIR_MEMO_AUDIO . $fileName; 

  if (!file_exists($fullPath)) {
    throw new Exception("The file you requested doesn't exist."); 
  }

} catch (Exception $e) {
  exit("Whoops, {$e->getMessage()}.");
}
?>
<!doctype html>
<html>
<head>
<title>
<h1>Sure you want to delete this file?</h1>
<p>There's no going back.</p>
<img src="media.php?fileName=<?php echo strip_tags($fileName);?>"/>
