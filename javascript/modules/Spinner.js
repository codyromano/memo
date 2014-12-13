(function (exports, Dispatcher) {
	function Spinner () {
		this.el = document.createElement('div'); 

		Dispatcher.listen('showedFirstImage', this.hide); 
	}

	Spinner.prototype.hide = function () {
		this.el.style.opacity = 0; 
	};

	exports.Spinner = Spinner; 

})(window, Dispatcher); 
