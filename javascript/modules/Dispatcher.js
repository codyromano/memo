(function (exports) {

  var Dispatcher = {}, events = {}; 

  Dispatcher.listen = function (eventName, callback) {
    if (!events[eventName]) {
      events[eventName] = []; 
    }
    events[eventName].push(callback); 
  };

  Dispatcher.broadcast = function (eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (callback) {
        callback(data);
      });
    }
  };

  exports.Dispatcher = Dispatcher; 

})(window);
