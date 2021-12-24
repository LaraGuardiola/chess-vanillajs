let dragged;
let lastMovedStartPos;
let lastMovedEndPos;
let tiles = document.querySelectorAll('.box')
let listen = (...args) => tiles.forEach(tile => tile.addEventListener(...args));

//*EVENTS

tiles.forEach(() =>{
  listen('dragstart', ondragstart, false)
  listen('dragover', ondragover, false)
  listen('dragleave', ondragleave, false)
  listen('drop', ondrop, false)
})

//*FUNCTIONS

function ondragstart(event){
  dragged = event.target; //the piece in this case
  lastMovedStartPos = dragged.parentNode;
  lastMovedStartPos.style.border = "3px solid black"
  if(lastMovedEndPos != null){
    lastMovedEndPos.style.removeProperty("border")
  }
}

function ondragover(event){
  event.preventDefault()
  if(event.target.className === 'box' || 'piece' && event.target.childElementCount === 0) return
  else{
    event.target.classList.add("ondragover")
  }
}

function ondragleave(event){
  event.preventDefault()
  event.target.classList.remove("ondragover")
}

function ondrop(event){
  lastMovedEndPos = event.target
	lastMovedEndPos.classList.remove("ondragover")
  lastMovedEndPos.style.border = "3px solid black"
  lastMovedStartPos.style.removeProperty("border")  

  if (lastMovedEndPos.className === 'box' && lastMovedEndPos.childElementCount === 0) { //if you are over a chess tile and drop it then removes the child from the parent and appends to the selected tile
    dragged.parentNode.removeChild(dragged);
		event.target.appendChild(dragged);  
	}
}
