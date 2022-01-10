let dragged
let lastMovedStartPos
let lastMovedEndPos
let color
let firstMove, normalMove //pawnzS

//? querySelector: 0.13ms vs getElementsByClassName: 0.08ms
console.time('getElementsByClassName')
let tiles2 = document.getElementsByClassName('box')
console.timeEnd('getElementsByClassName')
console.time('querySelector')
let tiles = document.querySelectorAll('.box')
console.timeEnd('querySelector')

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

//? arrow: 0.011ms vs function: 0.007ms
console.time('function en variable')
let setEvent = (...args) => tiles.forEach(tile => tile.addEventListener(...args));
console.timeEnd('function en variable')

/*console.time('function')
function setEvent(...args){
  tiles.forEach(function(tile){
    tile.addEventListener(...args)
  })
}
console.timeEnd('function')*/

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

//? forEach: 0.059ms vs for: 0.054ms
function removeTileBackgrounds(){
  console.time('for loop:')
  for(let i = 0; i < tilesArray.length; i++){
    if(tilesArray[i].classList.contains('ondragstart')){
      tilesArray[i].classList.remove('ondragstart')
    }
  }
  console.timeEnd('for loop:')
}

function removeTileBackgrounds(){
  console.time('forEach loop:')
  tilesArray.forEach(tile =>{
    if(tile.classList.contains("ondragstart")){
      tile.classList.remove("ondragstart")
    }
  })
  console.timeEnd('forEach loop:')
}

//* GAMEPLAY FUNCTIONS */

function checkPiece(event){ //can be refactored with a switch statement
  if(isPawn(event)){
    pawn(event)
  }
  if(isTower(event)){
    tower(event)
  }
  if(isKnight(event)){
    knight(event)
  }
  if(isBishop(event)){
    bishop(event)
  }
}

function isPawn(event){
  return event.target.classList.contains('pawn') ? true : false
}

function isTower(event){
  return event.target.classList.contains('tower') ? true : false
}

function isKnight(event){
  return event.target.classList.contains('knight') ? true : false
}

function isBishop(event){
  return event.target.classList.contains('bishop') ? true : false
}

function pawn(event){                       
  pawnMovement(event)
}

function tower(event){
  towerMovement(event)
}

function knight(event){
  knightMovement(event)
}

function bishop(event){
  bishopMovement(event)
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

//? ternario: 0.008ms if else: 0.007ms
console.time('ternario_primer_turno')
function isPawnFirstTurn(index){
  return piecesCounter.tiles[index] === 0 ? true : false
}
console.timeEnd('ternario_primer_turno')

console.time('if_else_primer_turno')
function isPawnFirstTurn(index){
  if(piecesCounter.tiles[index] === 0){
    return true
  }else{
    return false
  }
}
console.timeEnd('if_else_primer_turno')

//checks if tile has a piece inside
function checkCollision(index){
  return tilesArray[index].hasChildNodes() ? true : false
}


//checks if inside the tiles of a row there's a piece
function checkRowCollision(rowIndex,index){
  return rows[rowIndex][index].hasChildNodes() ? true : false
}

//checks if inside the tiles of a column there's a piece
function checkColumnCollision(arrayColumn,index){
  return arrayColumn[index].hasChildNodes() ? true : false
}

function createRows(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)   //in this case, 8 per group (8x8 = 64 tiles)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
}

function getColumn(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = rows[rowPos].indexOf(event.target.parentNode)
  let column = []

  if(column.length === 8){ //without this, every time you drag the piece it keeps pushing
    return
  }else{
    for(let i = 0; i < rows.length; i++){
      column.push(rows[i][indexRow])
    }
    return column
  }
}

function towerMovement(event){
  let type = event.target.className
  if(type === "piece white tower"){
    color = "white"
  }else{
    color = "black"
  }
  towerHorizontalMove(event)
  towerVerticalMove(event)
}

function towerHorizontalMove(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let row = rows[rowPos]
  let indexRow = rows[rowPos].indexOf(event.target.parentNode)
  let nonEmptySpaces = []

  for (let i = 0; i < row.length; i++) { //returns an array with the indexes where pieces are placed
    if (row[i].hasChildNodes())
        nonEmptySpaces.push(i);
  }

  let pieceRelativeToOthers = nonEmptySpaces.indexOf(indexRow) //gives index position for the array of pieces
  let movementArray = []

  if (pieceRelativeToOthers === 0)
    movementArray = row.slice(0, nonEmptySpaces[pieceRelativeToOthers + 1])
  else {
    movementArray = row.slice(nonEmptySpaces[pieceRelativeToOthers - 1] + 1, nonEmptySpaces[pieceRelativeToOthers + 1])
  }

  let distanceBetweenLeft = nonEmptySpaces[pieceRelativeToOthers] - nonEmptySpaces[pieceRelativeToOthers - 1]
  let distanceBetweenRight = nonEmptySpaces[pieceRelativeToOthers + 1] - nonEmptySpaces[pieceRelativeToOthers]

  if(isNaN(distanceBetweenLeft)){ //otherwise index could be less than 0, giving error
    distanceBetweenLeft = 0
  }
  if(isNaN(distanceBetweenRight)){ //like before, if index is out of bound is going to return an error
    distanceBetweenRight = 0
  }
  if(checkRowCollision(rowPos, indexRow - distanceBetweenLeft) && !tilesArray[indexPiece - distanceBetweenLeft].firstChild.classList.contains(color)){
    tilesArray[indexPiece - distanceBetweenLeft].classList.add('ondragstart')
  }
  if(checkRowCollision(rowPos, indexRow + distanceBetweenRight) && !tilesArray[indexPiece + distanceBetweenRight].firstChild.classList.contains(color)){
    tilesArray[indexPiece + distanceBetweenRight].classList.add('ondragstart')
  }
  
  movementArray.forEach(tile => {
    if(!tile.hasChildNodes()){
      tile.classList.add('ondragstart')
    }
  })
}

function towerVerticalMove(event){
  let column = getColumn(event)
  let nonEmptySpaces = []
  let indexColumn = column.indexOf(event.target.parentNode)

  for (let i = 0; i < column.length; i++) { 
    if (column[i].hasChildNodes())
        nonEmptySpaces.push(i);
  }

  let pieceRelativeOthers = nonEmptySpaces.indexOf(indexColumn) //gives index position for the array of pieces
  let movementArray = []

  if (pieceRelativeOthers === 0)
    movementArray = column.slice(0, nonEmptySpaces[pieceRelativeOthers + 1])
  else {
    movementArray = column.slice(nonEmptySpaces[pieceRelativeOthers - 1] + 1, nonEmptySpaces[pieceRelativeOthers + 1])
  }

  let distanceBetweenLeft = nonEmptySpaces[pieceRelativeOthers] - nonEmptySpaces[pieceRelativeOthers - 1]
  let distanceBetweenRight = nonEmptySpaces[pieceRelativeOthers + 1] - nonEmptySpaces[pieceRelativeOthers]

  if(isNaN(distanceBetweenLeft)){ //otherwise index could be less than 0, giving error
    distanceBetweenLeft = 0
  }
  if(isNaN(distanceBetweenRight)){ //like before, if index is out of bound is going to return an error
    distanceBetweenRight = 0
  }
  if(checkColumnCollision(column, indexColumn - distanceBetweenLeft) && !column[indexColumn - distanceBetweenLeft].firstChild.classList.contains(color)){
    column[indexColumn - distanceBetweenLeft].classList.add('ondragstart')
  }
  if(checkColumnCollision(column, indexColumn + distanceBetweenRight) && !column[indexColumn + distanceBetweenRight].firstChild.classList.contains(color)){
    column[indexColumn + distanceBetweenRight].classList.add('ondragstart')
  }

  movementArray.forEach(tile => {
    if(!tile.hasChildNodes()){
      tile.classList.add('ondragstart')
    }
  })
}

function knightMovement(event){
  let knightMovements = [-17,-15,-10,-6,6,10,15,17]
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className

  if(type === "piece white knight"){
    color = "white"
  }else{
    color = "black"
  }

  //Necessary in order to avoid unwanted movements to the other extreme of the board
  if(isKnightInFirstColumn(indexPiece)){
    knightMovements = [-17,-10,6,15]
  }
  if(isKnightInSecondColumn(indexPiece)){
    knightMovements = [-17,-15,-10,6,15,17]
  }
  if(isKnightInSeventhColumn(indexPiece)){
    knightMovements = [-17,-15,-6,10,15,17]
  }
  if(isKnightInEighthColumn(indexPiece)){
    knightMovements = [-15,-6,10,17]
  }
  
  knightMovements.forEach(move => {
    if(!isOutOfBounds(indexPiece - move)){
      tilesArray[indexPiece - move].classList.add('ondragstart')
    }
    tilesArray.forEach(tile => {
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    })  
  })
}

//? switch: 0.004ms VS if or: 0.0035ms VS if: 0.003ms (aprox)
console.time('switch')
function isKnightInSecondColumn(position){
  switch(position){
    case 1:
    case 9:
    case 17:
    case 25:
    case 33:
    case 41:
    case 49:
    case 57:
      return true
  }
}
console.timeEnd('switch')

console.time('if or')
function isKnightInFirstColumn(position){
  if(position === 1 || position === 9 || position === 17 || position === 25 || position === 33 || position === 41 || position === 49 || position === 57){
    return true
  }
}
console.timeEnd('if or')

console.time('if')
function isKnightInFirstColumn(position){
  if(position === 1)
  return true
  if(position === 9)
  return true
  if(position === 17)
  return true
  if(position === 25)
  return true
  if(position === 33)
  return true
  if(position === 41)
  return true
  if(position === 49)
  return true
  if(position === 57)
  return true
}
console.timeEnd('if')

function isKnightInFirstColumn(position){
  switch(position){
    case 0:
    case 8:
    case 16:
    case 24:
    case 32:
    case 40:
    case 48:
    case 56:
      return true
  }
}

function isKnightInSeventhColumn(position){
  switch(position){
    case 6:
    case 14:
    case 22:
    case 30:
    case 38:
    case 46:
    case 54:
    case 62:
      return true
  }
}

function isKnightInEighthColumn(position){
  switch(position){
    case 7:
    case 15:
    case 23:
    case 31:
    case 39:
    case 47:
    case 55:
    case 63:
      return true
  }
}

function isOutOfBounds(movement){
  return movement > 63 || movement < 0 ? true : false
}

function bishopMovement(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = rows[rowPos].indexOf(event.target.parentNode)
  let limit = 7 - indexRow
  let startPoint
  let frontCounter = []
  let behindCounter = []
  let firstHalfStartMovements = [0,1,2,3,4,5,6,7]

  if(type === "piece white bishop"){
    color = "white"
  }else{
    color = "black"
  }

  function checkEnemiesOnTheWay(){
    firstHalfStartMovements.forEach(tile =>{
      tile.classList.add('ondragstart')
      if(isInFront(tile, indexPiece) && tile.hasChildNodes()){
        frontCounter.push(tile)
      }
      if(!isInFront(tile, indexPiece) && tile.hasChildNodes()){
        behindCounter.push(tile)
      }
    })
  }

  function cleanIncorrectTiles(){
    let indexTopFirstEncounter = tilesArray.indexOf(frontCounter[frontCounter.length - 1])
    let indexBottomFirstEncounter = tilesArray.indexOf(behindCounter[1])
    
    tilesArray.forEach(tile => {
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color) || tilesArray.indexOf(tile) < indexTopFirstEncounter  && indexTopFirstEncounter != -1 || tilesArray.indexOf(tile) > indexBottomFirstEncounter && indexBottomFirstEncounter != -1){
        tile.classList.remove('ondragstart')
      }
    }) 
  }

  function topRightBottomLeftMovement(){
    startPoint = indexPiece - (limit * 7)

    if((limit * 7) > indexPiece){
      limit = rowPos
      startPoint = indexPiece - (7 * limit)
    }

    if(firstHalfStartMovements.includes(startPoint)){
      switch(startPoint){
        case 6:
          firstHalfStartMovements = [tilesArray[6],tilesArray[13],tilesArray[20],tilesArray[27],tilesArray[34],tilesArray[41],tilesArray[48]]
          checkEnemiesOnTheWay() 
          cleanIncorrectTiles()
          break
        case 5:
          firstHalfStartMovements = [tilesArray[5],tilesArray[12],tilesArray[19],tilesArray[26],tilesArray[33],tilesArray[40]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 4:
          firstHalfStartMovements = [tilesArray[4],tilesArray[11],tilesArray[18],tilesArray[25],tilesArray[32]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 3:
          firstHalfStartMovements = [tilesArray[3],tilesArray[10],tilesArray[17],tilesArray[24]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 2:
          firstHalfStartMovements = [tilesArray[2],tilesArray[9],tilesArray[16]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 1:
          firstHalfStartMovements = [tilesArray[1],tilesArray[8]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 0:
          firstHalfStartMovements = [tilesArray[0]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
      }
    }else{
      for(let i = startPoint; i < 64; i+=7){
        tilesArray[i].classList.add('ondragstart')
        if(isInFront(tilesArray[i], indexPiece) && tilesArray[i].hasChildNodes()){
          frontCounter.push(tilesArray[i])
        }
        if(!isInFront(tilesArray[i], indexPiece) && tilesArray[i].hasChildNodes()){
          behindCounter.push(tilesArray[i])
        }
      }
      cleanIncorrectTiles()
    }
  }

  function topLeftBottomRightMovement(){
    startPoint = indexPiece - (9 * indexRow)

    if((9 * indexRow) > indexPiece){
      indexRow = rowPos
      startPoint = indexPiece - (9 * indexRow)
    }
    

    if(firstHalfStartMovements.includes(startPoint)){
      switch(startPoint){
        case 1:
          firstHalfStartMovements = [tilesArray[1],tilesArray[10],tilesArray[19],tilesArray[28],tilesArray[37],tilesArray[46],tilesArray[55]]
          checkEnemiesOnTheWay() 
          cleanIncorrectTiles()
          break
        case 2:
          firstHalfStartMovements = [tilesArray[2],tilesArray[11],tilesArray[20],tilesArray[29],tilesArray[38],tilesArray[47]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 3:
          firstHalfStartMovements = [tilesArray[3],tilesArray[12],tilesArray[21],tilesArray[30],tilesArray[39]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 4:
          firstHalfStartMovements = [tilesArray[4],tilesArray[13],tilesArray[22],tilesArray[31]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 5:
          firstHalfStartMovements = [tilesArray[5],tilesArray[14],tilesArray[23]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 6:
          firstHalfStartMovements = [tilesArray[6],tilesArray[15]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
        case 7:
          firstHalfStartMovements = [tilesArray[7]]
          checkEnemiesOnTheWay()
          cleanIncorrectTiles()
          break
      }  
    }else{
      for(let i = startPoint; i < 64; i+=9){
        tilesArray[i].classList.add('ondragstart')
        if(isInFront(tilesArray[i], indexPiece) && tilesArray[i].hasChildNodes()){
          frontCounter.push(tilesArray[i])
        }
        if(!isInFront(tilesArray[i], indexPiece) && tilesArray[i].hasChildNodes()){
          behindCounter.push(tilesArray[i])
        }
      }
      cleanIncorrectTiles()
    }
  }
  topRightBottomLeftMovement()
  topLeftBottomRightMovement() 
}

function isInFront(tile,index){
  if(tilesArray.indexOf(tile) < index){
    return true
  }else{
    return false
  }
}
