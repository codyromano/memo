(function (exports, el) {

  function show () {
    el.classList.remove('hidden'); 
  }

  function hide () {
    el.classList.add('hidden'); 
  }

  exports.Loader = {
    show: show, 
    hide: hide
  };

})(window, document.querySelector('#loader')); 
