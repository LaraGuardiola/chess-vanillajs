let dragged
let lastMovedStartPos
let lastMovedEndPos
let color
let firstMove, normalMove //pawn
let tiles = document.querySelectorAll('.box')
let tilesArray = [].slice.call(document.querySelectorAll('.box')) //as an array you can get access to indexOf method
let rows = createRows(tilesArray,8)
let pieces = document.querySelectorAll('.piece')
let blackSection = document.querySelector('#blackSection')
let whiteSection = document.querySelector('#whiteSection')
let piecesCounter = { //useful to check if pawns have moved or not
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

//* UI FUNCTIONS */

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

//* GAMEPLAY FUNCTIONS */

function checkPiece(event){
  if(isPawn(event)){
    pawn(event)
  }
  if(isTower(event)){
    tower(event)
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

  isPawnFirstTurn(indexPiece) ? pawnFirstTurn(indexPiece) : pawnNormalTurn(indexPiece) 
}

function pawnFirstTurn(indexPiece){ //FIRST TURN
  if(checkCollision(normalMove - 1) && !tilesArray[normalMove - 1].firstChild.classList.contains(color)){   //if theres a piece within attack reach and has different color
    if(indexPiece % 8 === 0){ //multiples by 8
      tilesArray[normalMove - 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove - 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove + 1) && !tilesArray[normalMove + 1].firstChild.classList.contains(color)){
    if((indexPiece +1) % 8 === 0){  //non multiples by 8
      tilesArray[normalMove + 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove + 1].classList.add('ondragstart')
    }
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
}

function pawnNormalTurn(indexPiece){ //NORMAL TURN
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

//checks if pawn has already moved
function isPawnFirstTurn(index){
  return piecesCounter.tiles[index] === 0 ? true : false
}

//checks if tile has a piece inside
function checkCollision(index){
  return tilesArray[index].hasChildNodes() ? true : false
}

function checkRowCollision(rowIndex,index){
  return rows[rowIndex][index].hasChildNodes() ? true : false
}

function createRows(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)   //in this case, 8 per group (8x8 = 64 tiles)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
}

function towerMovement(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = rows[rowPos].indexOf(event.target.parentNode)
  let sonCount = 0

  let checkRowPieces = rows[rowPos].map(tile =>{ //returns tiles with sons (for a row)
    if(tile.hasChildNodes()){
      return rows[rowPos].indexOf(tile)
    }
  }).filter(tile => {
    if(tile != undefined){
      return tile
    }
  })

  console.log(checkRowPieces, indexRow)
}

let piecesArray = [undefined, 1, undefined, 2, undefined, undefined, 3, undefined];
let pieceToMove = 2;
let nonEmptySpaces = []
// Get non undefined spaces
for (let i = 0; i < piecesArray.length; i++) {
if (piecesArray[i] != undefined)
    nonEmptySpaces.push(i);
}
let pieceToMoveIndex = piecesArray.indexOf(pieceToMove);
let pieceRelativeToOthers = nonEmptySpaces.indexOf(pieceToMoveIndex); //[1,3,6] it will return a 2 (so it has 2 pieces in the same row)
let movementArray = []
// Get array with undefineds around the used position
if (pieceRelativeToOthers == 0)
    movementArray = piecesArray.slice(0, nonEmptySpaces[pieceRelativeToOthers + 1]);
else {
    movementArray = piecesArray.slice(nonEmptySpaces[pieceRelativeToOthers - 1] + 1, nonEmptySpaces[pieceRelativeToOthers + 1]);
}

console.log(nonEmptySpaces[pieceRelativeToOthers + 1])

function towerHorizontalMove(arrayRow){
  let nonEmptySpaces = []
  for (let i = 0; i < arrayRow.length; i++) {
    if (arrayRow[i] != undefined)
        nonEmptySpaces.push(i);
  }
}