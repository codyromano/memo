<!doctype html>
<html>
<head>
  <title>Memos</title>
  <link rel="stylesheet" href="/memo/memos.css" type="text/css"/>

  <meta charset="UTF-8" />
  <meta name="robots" content="noindex,nofollow"/>
  <meta name="viewport" content="width=device-width, user-scalable=no">
  <script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-31197199-1']);
  _gaq.push(['_trackPageview']);
  (function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  </script>
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

    <a href="#" id="settings">Delete Photo</a>

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
