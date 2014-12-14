(function (exports, Dispatcher) {

  var API = AudioProgressIndicator = {}; 

  API.init = function (statusEl, progressEl) {
    var _self = this; 

    this.statusEl = statusEl; 
    this.progressEl = progressEl; 

    Dispatcher.listen('audioLoadProgress', API.displayProgress); 
    Dispatcher.listen('audioLoadStarted', function () {
      _self.statusEl.innerHTML = 'Loading Audio'; 
    });
  };

  API.displayProgress = function (progress) {
    API.statusEl.innerHTML = '';
    API.progressEl.style.width = progress + '%'; 
  };

  exports.AudioProgressIndicator = API; 

})(window, Dispatcher); 
