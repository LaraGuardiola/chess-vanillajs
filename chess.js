let dragged
let lastMovedStartPos
let lastMovedEndPos
let color
let firstMove, normalMove //pawn
let boardLimitsObj = { //boardLimitsObj.row0[1] means 7
  row0: [0,7],
  row1: [8,15],
  row2: [16,23],
  row3: [24,31],
  row4: [32,39],
  row5: [40,47],
  row6: [48,55],
  row7: [56,63]
}
let tiles = document.querySelectorAll('.box')
let tilesArray = [].slice.call(document.querySelectorAll('.box')) //as an array you can get access to indexOf method
let rows = createRows(tilesArray,8)
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
  dragged = event.target
  lastMovedStartPos = dragged.parentNode
  lastMovedStartPos.style.border = "3px solid black"

  //first time playing lastMovedEndPos is not initialized so this if is necessary to catch the undefined it was going to give otherwise
  if(lastMovedEndPos != null){
    lastMovedEndPos.style.removeProperty("border")
  }
}

function ondragover(event){
  event.preventDefault()
  if(event.target.classList.contains('ondragstart') || event.target.parentNode.classList.contains('ondragstart')){ //movement possible if tile has ondragstart or span's father has it
    event.dataTransfer.dropEffect = "all"  //drop it
  }else{ 
    event.dataTransfer.dropEffect = "none" // dropping is not allowed
  }
  //event.target.classList.add("ondragover")   
}

function ondragleave(event){
  event.preventDefault()
  event.target.classList.remove("ondragover")
}

function ondrop(event){
  removeTileBackgrounds()
  changeTurn(event) 
  dragged.parentNode.removeChild(dragged)

  if(event.target.classList.contains('piece')){  //if dropped at span, replace content
    event.target.replaceWith(dragged)
    return
  }

  if(event.target.hasChildNodes()){               //if dropped at div with a piece, drop firstChild
    event.target.removeChild(event.target.firstChild)
  }
	event.target.appendChild(dragged)
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
  }
  if(isTower(event)){
    test(event)
  }
}

function isPawn(event){
  return event.target.classList.contains('pawn') ? true : false
}

function isTower(event){
  return event.target.classList.contains('tower') ? true : false
}

function pawn(event){                       
  pawnMovement(event)
}

function tower(event){
  towerMovement(event)
}

function pawnMovement(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8) //get row position
  let type = event.target.className

  if(type === 'piece white pawn'){ //WHITE PAWN
    firstMove = indexPiece - 16
    normalMove = indexPiece - 8
    color = "white"
  }else{
    firstMove = indexPiece + 16   //BLACK PAWN
    normalMove = indexPiece + 8
    color = "black"
  }

  if(isPawnFirstTurn(indexPiece)){ //FIRST TURN
    if(checkCollision(normalMove - 1) && !tilesArray[normalMove - 1].firstChild.classList.contains(color)){   //if theres a piece within attack reach and has different color
      tilesArray[normalMove - 1].classList.add('ondragstart')
    }
    if(checkCollision(normalMove + 1) && !tilesArray[normalMove + 1].firstChild.classList.contains(color)){
      tilesArray[normalMove + 1].classList.add('ondragstart')
    }
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
  }else{//NORMAL TURN  - checks attack positions, if its different color
    if(checkCollision(normalMove - 1) && !tilesArray[normalMove - 1].firstChild.classList.contains(color)){
      if(indexPiece % 8 === 0){
        tilesArray[normalMove - 1].classList.remove('ondragstart')
      }else{
        tilesArray[normalMove - 1].classList.add('ondragstart')
      }
    }
    if(checkCollision(normalMove + 1) && !tilesArray[normalMove + 1].firstChild.classList.contains(color)){
      if((indexPiece +1) % 8 === 0){
        tilesArray[normalMove + 1].classList.remove('ondragstart')
      }else{
        tilesArray[normalMove + 1].classList.add('ondragstart')
      }
    }
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

function createRows(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)   //in this case, 8 per group (8x8 = 64 tiles)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}

function test(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8) //get row position
  let indexRightPiece = rows[rowPos].indexOf(event.target.parentNode) + 1
  let indexLeftPiece = rows[rowPos].indexOf(event.target.parentNode) - 1

  console.log("rowPosition: ",rowPos," index Board: ", indexPiece)

  //going right
  while(indexRightPiece < 8){
    if(!rows[rowPos][indexRightPiece].hasChildNodes()){
      rows[rowPos][indexRightPiece].classList.add('ondragstart')
      indexRightPiece++
    }else{
      return
    }
  }
  
  //going left
  while(indexLeftPiece > -1){
    if(!rows[rowPos][indexLeftPiece].hasChildNodes()){
      rows[rowPos][indexLeftPiece].classList.add('ondragstart')
      indexLeftPiece--
    }else{
      return
    }
  }

  //not properly working

}

//console.log(boardLimitsObj.row1[1])