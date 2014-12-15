<!doctype html>
<html>
<head>
  <title>Memos</title>
  <link rel="stylesheet" href="/memo/memos.css" type="text/css"/>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex,nofollow"/>
  <meta name="viewport" content="width=device-width, user-scalable=no">
</head>
<body>
  <header>
    <h1></h1>
    <h2></h2>
  </header>

  <div id="audioProgressIndicator" class="hidden">
    <div class="loadProgressWrapper">
      <p></p>
      <div class="loadProgressInner"></div>
    </div>
  </div>

  <div id="loader" class="hidden"></div>
  <div id="featuredImage"></div>

  <div id="qualitySetting" class="hidden">
    <div>
      <h3>Choose Quality</h3>
      <ul>
        <li>
          <a data-image-quality-setting="compressed">
            <strong>Medium</strong>
            <p>For devices without Wi-Fi</p>
          </a>
        </li>

        <li>
          <a data-image-quality-setting="full">
            <strong>High</strong>
            <p>For devices with fast Wi-Fi</p>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- Paths must be absolute because of Apache rewrite --> 
  <script src="/memo/javascript/modules/Dispatcher.js"></script>
  <script src="/memo/javascript/modules/User.js"></script>
  <script src="/memo/javascript/modules/AudioProgressIndicator.js"></script>
  <script src="/memo/javascript/modules/AudioPlayer.js"></script>
  <script src="/memo/javascript/modules/Loader.js"></script>
  <script src="/memo/javascript/modules/ImageGallery.js"></script>
  <script src="/memo/javascript/index.js"></script>

</body>
</html>
