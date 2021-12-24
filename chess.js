let dragged;
let lastMovedStartPos;
let lastMovedEndPos;
let tiles = document.querySelectorAll('.box')
let pieces = document.querySelectorAll('.piece')
let blackPieces = document.querySelectorAll('.black')
let whitePieces = document.querySelectorAll('.white')
let blackSection = document.querySelector('.blackSection')
let whiteSection = document.querySelector('.whiteSection')
let setEvent = (...args) => tiles.forEach(tile => tile.addEventListener(...args));

//*EVENTS

tiles.forEach(() =>{
  setEvent('dragstart', ondragstart, false)
  setEvent('dragover', ondragover, false)
  setEvent('dragleave', ondragleave, false)
  setEvent('drop', ondrop, false)
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
  if (event.target.getAttribute("draggable") == "true" || event.target.hasChildNodes()){ //if you are over a span piece or a div box then drop not allowed
    event.dataTransfer.dropEffect = "none"; // dropping is not allowed
  }else{
    event.dataTransfer.dropEffect = "all";  // drop it
    event.target.classList.add("ondragover") 
  }        
}

function ondragleave(event){
  event.preventDefault()
  event.target.classList.remove("ondragover")
}

function ondrop(event){
  changeTurn()

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

function changeTurn(){
  pieces.forEach(piece => {
    if(piece.getAttribute("draggable") == "true"){
      piece.setAttribute("draggable", false)
      whiteSection.style.display = "none"
      blackSection.style.display = "block"
    }else{
      piece.setAttribute("draggable", true)
      whiteSection.style.display = "block"
      blackSection.style.display = "none"
    }
  })
}

/*function hasWhiteMoved(){
  let draggableAttr = document.querySelectorAll('.piece').getAttribute('draggable')
  let turnToggle = draggableAttr === 'false' ? 'true' : 'false'
}*/

