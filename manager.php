<?php
require_once 'stdlib.php';

try {
  if (!isset($_GET['fileName'])) {
    throw new Exception("You must provide a file."); 
  }
  $fileName = $_GET['fileName'];
  $fullPath = DIR_MEMO_AUDIO . $fileName;

  $thumbSrc = ''; 

  // Use a compressed image if one exists
  if (file_exists(FILE_COMPRESSED_PREFIX . $fullPath)) {
    $thumbSrc = FILE_COMPRESSED_PREFIX . $fileName;

  // Otherwise fall back to full resolution
  } else if (file_exists($fullPath)) {
    $thumbSrc = $fileName; 
  } else {
    throw new Exception("The file you requested doesn't exist."); 
  }

  $referrer = (isset($_GET['ref'])) ? strip_tags($_GET['ref']) : '';

  if (isset($_POST['p'])) {
    $password = $_POST['p']; 
    $passHash = hash(ADMIN_PASSWORD_ALGO, trim(strtolower($password)) . ADMIN_PASSWORD_SALT); 

    if ($passHash === ADMIN_PASSWORD_HASH) {
      if (unlink($fullPath) === true) { 
        header("Location: $referrer"); 
        exit;
      } else {
        throw new Exception("couldn't delete your file.");
      }
      /* 
      */
    } else {
      $invalidPassword = true; 
    }
  }

} catch (Exception $e) {
  exit("Whoops, {$e->getMessage()}.");
}
?>
<!doctype html>
<html>
<head>
  <title>Manage Delete</title>
  <link rel="stylesheet" href="upload/main.css" type="text/css"/>
    <meta name="robots" content="noindex,nofollow"/>
  <meta name="viewport" content="width=device-width">
</head>
<body>

<main id="deletePage">
  <h1>Enter password to delete</h1>

    <div class="thumbnailWrapper">
    <div class="thumbnailPreview" style="background-image:url('media.php?fileName=<?php echo $thumbSrc;?>')"></div>
  </div>

  <form method="post" name="deletePhoto">
    <fieldset>
      <input type="password" name="p" placeholder="Password" class="focusTags"/>
    </fieldset>

    <?php
    if (isset($invalidPassword)) {
      echo "<p class='warning'><b>Invalid password</b></p>";
    }
    ?>

    <a class="actionBtn actionBtnInline backBtn">Cancel</a>
    <a class="actionBtn actionBtnInline destructiveBtn" onclick="document.deletePhoto.submit();">Delete</a>
  </form>
</main>

<script>
(function () {
  var firstInput = document.querySelectorAll('input')[0],
  cancelBtn = document.querySelectorAll('.backBtn')[0];

  // TODO: Improve this; embedding PHP in JavaScript is a messy bad practice
  referrer = "<?php echo $referrer;?>";  
  firstInput.focus(); 

  cancelBtn.addEventListener('click', function () {
    window.location = referrer.length > 0 ? referrer : '/memo/';
  }, false); 
})(); 
</script>

</body>
</html>
