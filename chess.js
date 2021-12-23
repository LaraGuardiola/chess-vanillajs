let dragged;
let lastMovedStartPos;
let lastMovedEndPos;
let tiles = document.querySelectorAll('.box')
let fichas = [].slice.call(document.querySelectorAll('.box'))
console.log(document)
let listen = (...args) => fichas.forEach(tile => tile.addEventListener(...args));

//*EVENTS

listen('dragstart', event => {
	dragged = event.target; //the piece in this case
  lastMovedStartPos = dragged.parentNode;
  lastMovedStartPos.style.border = "3px solid black"
  if(lastMovedEndPos != null){
    lastMovedEndPos.style.removeProperty("border")
  }
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
  lastMovedEndPos = event.target
	lastMovedEndPos.classList.remove("ondragover")
  lastMovedEndPos.style.border = "3px solid black"
  lastMovedStartPos.style.removeProperty("border")  

  if (lastMovedEndPos.className === 'box' && lastMovedEndPos.childElementCount === 0) { //if you are over a chess tile and drop it then removes the child from the parent and appends to the selected tile
    dragged.parentNode.removeChild(dragged);
		event.target.appendChild(dragged);  
	}
}, false)
