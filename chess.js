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
  removeTileBackgrounds()
  changeTurn(event)  
  dragged.parentNode.removeChild(dragged);
	event.target.appendChild(dragged);  
}

/* UI FUNCTIONS */

function changeTurn(event){
  pieces.forEach(piece => {
    let draggableToggle = piece.getAttribute("draggable") === 'true' ? 'false' : 'true'
    piece.setAttribute('draggable',draggableToggle)
  })
  piecesCounter.addPieceTurn(tilesArray.indexOf(event.target)) //add 1 to the counter meaning pawn has already moved at least once
  setStylesForNextTurn(event)
  updateTurnSections()
}

function setStylesForNextTurn(event){
  lastMovedEndPos = event.target
	lastMovedEndPos.classList.remove("ondragover")
  lastMovedEndPos.style.border = "3px solid black"
  lastMovedStartPos.style.removeProperty("border")
}

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
  pawnMovement(event)
}

function pawnMovement(event){
  let firstMove, normalMove
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className

  if(type === 'piece white pawn'){ //WHITE PAWN
    firstMove = indexPiece - 16
    normalMove = indexPiece - 8
  }else{
    firstMove = indexPiece + 16   //BLACK PAWN
    normalMove = indexPiece + 8
  }

  if(isPawnFirstTurn(indexPiece)){
    if(checkCollision(normalMove)){
      return
    }else{
      if(checkCollision(firstMove)){
        tilesArray[normalMove].classList.add('ondragstart')
      }else{
        tilesArray[normalMove].classList.add('ondragstart')
        tilesArray[firstMove].classList.add('ondragstart')  
      }
    }
  }else{
    if(checkCollision(normalMove)){ //checks if in front there's a piece 
      return
    }else{
      tilesArray[normalMove].classList.add('ondragstart')
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
