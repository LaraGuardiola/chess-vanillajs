let dragged;
let listen = (...args) => document.addEventListener(...args);

listen('dragstart', event => {
	dragged = event.target; //the piece in this case
}, false)

listen('dragover', event => event.preventDefault(), false);

listen('drop', event => {
	event.preventDefault();
	
	if (event.target.className === 'box') { //if you are over a chess tile and drop it then removes the child from the parent and appends to the selected tile
		dragged.parentNode.removeChild(dragged);
		event.target.appendChild(dragged);
	}
}, false)