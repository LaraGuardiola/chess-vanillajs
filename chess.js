let dragged;
let lastMovedStartPos;
let lastMovedEndPos;
let tiles = document.querySelectorAll('.box')
let tilesArray = [].slice.call(document.querySelectorAll('.box')) //as an array you can get access to indexOf method
let pieces = document.querySelectorAll('.piece')
let blackSection = document.querySelector('#blackSection')
let whiteSection = document.querySelector('#whiteSection')
let piecesCounter = {
  tiles : tilesArray.map(() => 0),
  addPieceTurn : index => {
    piecesCounter.tiles[index]++
  }
}
let setEvent = (...args) => tiles.forEach(tile => tile.addEventListener(...args));

//*EVENTS

tiles.forEach(() =>{
  setEvent('click', removeTileBackgrounds,false) //workaround to fix multiple backgrounds if dragged piece is returned to its original place 
  setEvent('dragstart', ondragstart, false)
  setEvent('dragover', ondragover, false)
  setEvent('dragleave', ondragleave, false)
  setEvent('drop', ondrop, false)
})

//* DRAG AND DROP FUNCTIONS

function ondragstart(event){
  
  checkPiece(event)
  
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
  if (event.target.getAttribute("draggable") === "true" || event.target.hasChildNodes()){ //if you are over a span piece or a div box then drop not allowed
    if(!event.target.classList.contains('dragstart')){
      console.log('enters')
      event.dataTransfer.dropEffect = "none"; // dropping is not allowed
    }
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
  removeTileBackgrounds()
  changeTurn()
  piecesCounter.addPieceTurn(tilesArray.indexOf(event.target)) //add 1 to the counter meaning pawn has already moved at least once

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

/* UI FUNCTIONS */

function changeTurn(){
  pieces.forEach(piece => {
    let draggableToggle = piece.getAttribute("draggable") === 'true' ? 'false' : 'true'
    piece.setAttribute('draggable',draggableToggle)
  })
  updateTurnSections()
}

let displayToggle = whiteSection.style.display === "block" ? "none" : "block"

function updateTurnSections(){
  if(whiteSection.style.display === "none" && blackSection.style.display === "block"){
    whiteSection.style.display = "block"
    blackSection.style.display = "none"
  }else{
    whiteSection.style.display = "none"
    blackSection.style.display = "block"
  }
}

function removeTileBackgrounds(){
  tilesArray.forEach(tile =>{
    if(tile.classList.contains("ondragstart")){
      tile.classList.remove("ondragstart")
    }
  })
}

/* GAMEPLAY FUNCTIONS */

function checkPiece(event){
  if(isPawn(event)){
    pawn(event)
  }else{
    console.log("not a pawn")
  }
}

function isPawn(event){
  return event.target.classList.contains('pawn') ? true : false
}

function pawn(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  if(event.target.classList.contains('white')){   // WHITE PIECES
    if(isPawnFirstTurn(indexPiece)){
      tilesArray[indexPiece - 8].classList.add('ondragstart')
      tilesArray[indexPiece - 16].classList.add('ondragstart')
    }else{
      if(checkCollision(indexPiece - 8)){ //checks if in front there's a piece 
        return
      }else{
        tilesArray[indexPiece - 8].classList.add('ondragstart')
      }
    }
  }else{                                          // BLACK PIECES
    if(isPawnFirstTurn(indexPiece)){
      tilesArray[indexPiece + 8].classList.add('ondragstart')
      tilesArray[indexPiece + 16].classList.add('ondragstart')
    }else{
      if(checkCollision(indexPiece + 8)){
        return
      }else{
        tilesArray[indexPiece + 8].classList.add('ondragstart')
      }
    }
  }
}

//checks if pawn has already moved
function isPawnFirstTurn(index){
  return piecesCounter.tiles[index] === 0 ? true : false
}

//checks if tile has a piece inside
function checkCollision(index){
  return tilesArray[index].hasChildNodes() ? true : false
}