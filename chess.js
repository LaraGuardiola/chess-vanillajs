let dragged;
let lastMovedStartPos;
let lastMovedEndPos;
let tiles = document.querySelectorAll('.box')
let pieces = document.querySelectorAll('.piece')
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
  dragged = event.target;
  lastMovedStartPos = dragged.parentNode;
  lastMovedStartPos.style.border = "3px solid black"
  //first time playing lastMovedEndPos is not initialized so this if is necessary to catch the undefined it was going to give otherwise
  if(lastMovedEndPos != null){
    lastMovedEndPos.style.removeProperty("border")
  }
}

function ondragover(event){
  event.preventDefault()
  if (event.target.getAttribute("draggable") == "true" || event.target.hasChildNodes()){
    event.dataTransfer.dropEffect = "none"; // dropping is not allowed
  }else{
    event.dataTransfer.dropEffect = "all";
        event.target.classList.add("ondragover") // drop it
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

  //if you are over a chess tile and drop it then removes the child from the parent and appends to the selected tile
  if (lastMovedEndPos.className === 'box' && lastMovedEndPos.childElementCount === 0) { 
    dragged.parentNode.removeChild(dragged);
		event.target.appendChild(dragged);  
	}
}
