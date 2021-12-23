let dragged;
let lastMoved;
let listen = (...args) => document.addEventListener(...args);

listen('dragstart', event => {
	dragged = event.target; //the piece in this case
  lastMoved = dragged.parentNode;
  lastMoved.style.border = "3px solid black"
}, false)

listen('dragover', event => {
  event.preventDefault()
  event.target.classList.add("ondragover")
  }
  , false);

listen('dragleave', event => {
  event.preventDefault()
  event.target.classList.remove("ondragover")
}, false)

listen('drop', event => {
	event.preventDefault();
	event.target.classList.remove("ondragover")
  event.target.style.border = "3px solid black"
  lastMoved.style.removeProperty("border")


	if (event.target.className === 'box') { //if you are over a chess tile and drop it then removes the child from the parent and appends to the selected tile
		dragged.parentNode.removeChild(dragged);
		event.target.appendChild(dragged);  
	}
}, false)