(function (exports, Dispatcher) {
  "use strict";

  var API = {};
  var AudioProgressIndicator = {}; 

  API.init = function (statusEl, progressEl, wrapperEl) {
    var _self = this; 

    this.statusEl = statusEl; 
    this.progressEl = progressEl; 
    this.wrapperEl = wrapperEl; 

    Dispatcher.listen('audioLoadProgress', API.displayProgress); 
    Dispatcher.listen('audioLoadStarted', function () {
      _self.statusEl.innerHTML = 'Loading Audio';
      _self.show();   
    });

    Dispatcher.listen('audioCanPlay', function (audioEl) {
      _self.hideStatus(); 
      _self.wrapperEl.appendChild(audioEl); 
    }); 
  };

  API.hideStatus = function () {
    this.statusEl.classList.add('hidden'); 
  };

  API.show = function () {
    this.wrapperEl.classList.remove('hidden'); 
  };

  API.displayProgress = function (progress) {
    //API.statusEl.innerHTML = '';
    //API.progressEl.style.width = progress + '%'; 
  };

  exports.AudioProgressIndicator = API; 

})(window, Dispatcher); 
