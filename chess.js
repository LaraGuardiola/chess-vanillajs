import * as util from './modules/util.js'

//*EVENTS

util.tiles.forEach(() =>{
  util.setEvent('click', cleanBoard,false) //workaround to fix multiple backgrounds if dragged piece is returned to its original place 
  util.setEvent('dragstart', ondragstart, false)
  util.setEvent('touchstart',ondragstart, false)
  util.setEvent('dragover', ondragover, false)
  util.setEvent('dragleave', ondragleave, false)
  util.setEvent('drop', ondrop, false)
})

//* DRAG AND DROP FUNCTIONS

let dragged
let lastMovedStartPos
let lastMovedEndPos

function ondragstart(event){
  cleanTiles()
  checkPiece(event)
  dragged = event.target
  lastMovedStartPos = dragged.parentNode
  lastMovedStartPos.style.border = '3px solid black'
  util.borderFlag.push(lastMovedStartPos)
  if(util.borderFlag.length > 1){
    if(util.borderFlag[0] === util.borderFlag[1]){
      util.borderFlag.shift()
      return
    }
    util.borderFlag[0].style.removeProperty('border')
    util.borderFlag.shift()
  }
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
  cleanBoard()
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
  util.pieces.forEach(piece => {
    let draggableToggle = piece.getAttribute("draggable") === 'true' ? 'false' : 'true'
    piece.setAttribute('draggable',draggableToggle)
  })
  util.piecesCounter.addPieceTurn(util.tilesArray.indexOf(event.target)) //add 1 to the counter meaning pawn has already moved at least once
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

function cleanBoard(){
  util.tilesArray.forEach(tile =>{
    if(tile.classList.contains("ondragstart")){
      tile.classList.remove("ondragstart")
    }
    if(tile.style.border === "3px solid black"){
      tile.style.removeProperty('border')
    }
  })
}

function cleanTiles(){
  util.tilesArray.forEach(tile =>{
    if(tile.classList.contains('ondragstart')){
      if(util.ondragstartTiles.counter.indexOf(tile) !== -1){
        return
      }
      util.ondragstartTiles.counter.push(tile)
    }
  })
  util.ondragstartTiles.lengths.push(util.ondragstartTiles.counter.length)
  if(util.ondragstartTiles.lengths.length > 1 ) {
    util.ondragstartTiles.lengths.shift()
    for(let i = 0; i < util.ondragstartTiles.lengths[0]; i++){
      util.ondragstartTiles.counter[i].classList.remove('ondragstart')
    }
    util.ondragstartTiles.counter.splice(0,util.ondragstartTiles.lengths[0])
  }
}

//* GAMEPLAY FUNCTIONS */

function checkPiece(event){ 
  if(isPawn(event)) pawnMovement(event)
  if(isRook(event)) rookMovement(event)
  if(isKnight(event)) knightMovement(event)
  if(isBishop(event)) bishopMovement(event)
  if(isQueen(event)) queenMovement(event)
  if(isKing(event)) kingMovement(event)
}

function isPawn(event){
  return event.target.classList.contains('pawn') ? true : false
}

function isRook(event){
  return event.target.classList.contains('tower') ? true : false
}

function isKnight(event){
  return event.target.classList.contains('knight') ? true : false
}

function isBishop(event){
  return event.target.classList.contains('bishop') ? true : false
}

function isQueen(event){
  return event.target.classList.contains('queen') ? true : false
}

function isKing(event){
  return event.target.classList.contains('king') ? true : false
}

//* MOVEMENTS */


let firstMove
let normalMove
let color
//*PAWN
function pawnMovement(event){
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
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
  if(checkCollision(normalMove - 1) && !util.tilesArray[normalMove - 1].firstChild.classList.contains(color)){   //if theres a piece within attack reach and has different color
    if(indexPiece % 8 === 0){ //multiples by 8
      util.tilesArray[normalMove - 1].classList.remove('ondragstart')
    }else{
      util.tilesArray[normalMove - 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove + 1) && !util.tilesArray[normalMove + 1].firstChild.classList.contains(color)){
    if((indexPiece +1) % 8 === 0){  //non multiples by 8
      util.tilesArray[normalMove + 1].classList.remove('ondragstart')
    }else{
      util.tilesArray[normalMove + 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove)){
    return
  }else{
    if(checkCollision(firstMove)){
      util.tilesArray[normalMove].classList.add('ondragstart')
    }else{
      util.tilesArray[normalMove].classList.add('ondragstart')
      util.tilesArray[firstMove].classList.add('ondragstart')  
    }
  }
  
}

function pawnNormalTurn(indexPiece){ //NORMAL TURN
  if(checkCollision(normalMove - 1) && !util.tilesArray[normalMove - 1].firstChild.classList.contains(color)){
    if(indexPiece % 8 === 0){ 
      util.tilesArray[normalMove - 1].classList.remove('ondragstart')
    }else{
      util.tilesArray[normalMove - 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove + 1) && !util.tilesArray[normalMove + 1].firstChild.classList.contains(color)){
    if((indexPiece +1) % 8 === 0){
      util.tilesArray[normalMove + 1].classList.remove('ondragstart')
    }else{
      util.tilesArray[normalMove + 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove)){ //checks if in front there's a piece 
    return
  }else{
    util.tilesArray[normalMove].classList.add('ondragstart')
  }
}

//checks if pawn has already moved
function isPawnFirstTurn(index){
  return util.piecesCounter.tiles[index] === 0 ? true : false
}

//checks if tile has a piece inside
function checkCollision(index){
  return util.tilesArray[index].hasChildNodes() ? true : false
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
    for(let row of rows){
      column.push(row[indexRow])
    }
    return column
  }
}

  //* ROOK */
function rookMovement(event){
  let type = event.target.className
  if(type.includes('white')) color = 'white'
  else color = 'black'
  rookHorizontalMove(event)
  rookVerticalMove(event)
}

function printMovementTiles(movementArray){
  movementArray.forEach(tile => {
    if(!tile.hasChildNodes()){
      tile.classList.add('ondragstart')
    }
  })
}

function rookHorizontalMove(event){
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
  printMovementTiles(movementArray)
}

function rookVerticalMove(event){
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
  printMovementTiles(movementArray)
}

  //* KNIGHT */
function knightMovement(event){
  let knightMovements = [-17,-15,-10,-6,6,10,15,17]
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className

  if(type.includes('white')) color = 'white'
  else color = 'black'

  //Necessary in order to avoid unwanted movements to the other extreme of the board
  if(isInFirstColumn(indexPiece)) knightMovements = [-17,-10,6,15]
  if(isInSecondColumn(indexPiece)) knightMovements = [-17,-15,-10,6,15,17]
  if(isInSeventhColumn(indexPiece)) knightMovements = [-17,-15,-6,10,15,17]
  if(isInEighthColumn(indexPiece)) knightMovements = [-15,-6,10,17]
  
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

//switch statements are slightly more efficient than ifs statements (0,008 ms vs 0,005)
function isInSecondColumn(position){
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

function isInFirstColumn(position){
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

function isInSeventhColumn(position){
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

function isInEighthColumn(position){
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

  //* BISHOP */
function bishopMovement(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = rows[rowPos].indexOf(event.target.parentNode)
  let type = event.target.className
  let piecesLeftRight = []
  let piecesRightLeft = []

  if(type.includes('white')) color = 'white'
  else color = 'black'

  /* **************** LEFT TO RIGHT ******************** */

  //calculates starting row and index row for topLeft
  let indexRowStartPointLeftRight = 0
  let startingPointTopLeft = rowPos - indexRow
  if(startingPointTopLeft < 0){
    startingPointTopLeft = 0
    indexRowStartPointLeftRight = indexRow - rowPos
  }

  //calculates starting tilesArray index for topLeft
  let ogIndexRow = indexRow
  if(indexRow > rowPos){
    indexRow = rowPos
  }
  let startTopLeft = ((rowPos * 8) + ogIndexRow) - (9 * indexRow)
  
  //calculates ending tilesArray index for topLeft
  let distanceToEndRow =  7 - ogIndexRow
  let endTopLeft = indexPiece + (9 * distanceToEndRow)
  if(endTopLeft > 63){
    distanceToEndRow = 7 - rowPos
    endTopLeft = indexPiece + (distanceToEndRow * 9)
  }

  //creates the diagonal array for topLeft
  function topLeftBottomRight(){
    for(let i = startingPointTopLeft; i < 8; i++){
      piecesLeftRight.push(rows[i][indexRowStartPointLeftRight])
      if(indexRowStartPointLeftRight === 7){
        return
      }
      indexRowStartPointLeftRight++
    }
  }
  topLeftBottomRight() 
 
  //within the diagonal array finds the nearest encounters
  function findFirstEncountersLeftRight(){
    let aheadArray = []
    let behindArray = []
    let finalArray = []
    let firstAhead, firstBehind

    for(let piece of piecesLeftRight){
      if(tilesArray.indexOf(piece) === indexPiece){
        continue
      }
      if(piece.hasChildNodes() && indexPiece > tilesArray.indexOf(piece)){
        aheadArray.push(tilesArray.indexOf(piece))
        firstAhead = Math.max(...aheadArray)
      }
      if(piece.hasChildNodes() && indexPiece < tilesArray.indexOf(piece)){
        behindArray.push(tilesArray.indexOf(piece))
        firstBehind = Math.min(...behindArray)
      }
    }

    //treating different cases
    if(!isNaN(firstAhead) && !isNaN(firstBehind)){   //Has pieces in front and behind
      for(let i = firstAhead; i < firstBehind + 1; i+=9){
        finalArray.push(tilesArray[i])
      }
    }
    if(isNaN(firstAhead) && !isNaN(firstBehind)){   //Only has pieces behind
      for(let x = startTopLeft; x < firstBehind + 1; x+=9){
        finalArray.push(tilesArray[x])
      }
    }
    if(!isNaN(firstAhead) && isNaN(firstBehind)){   //Only has pieces in front
      for(let y = firstAhead; y < endTopLeft + 1; y+=9){
        finalArray.push(tilesArray[y])
      }
    }
    if(isNaN(firstAhead) && isNaN(firstBehind)){    //Pieces neither behind or in 
      for(let z = startTopLeft; z < endTopLeft + 1; z+=9){
        finalArray.push(tilesArray[z])
      }
    }

    //paiting and removing unnecessary tiles
    finalArray.forEach(tile =>{
      tile.classList.add('ondragstart')
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    }) 
  }
  findFirstEncountersLeftRight()

  /* **************** RIGHT TO LEFT ******************** */

  //calculates starting tilesArray index for topRight
  let startTopRight = indexPiece - ((7 - ogIndexRow) * 7)
  if(startTopRight < 0){
    startTopRight = indexPiece - (rowPos * 7)
  }

  //calculates ending tilesArray index for topRight
  let distanceToEndRowRight = ogIndexRow
  let endTopRight = indexPiece + (7 * distanceToEndRowRight)
  if(endTopRight > 63){
    distanceToEndRowRight = 7 - rowPos
    endTopRight = indexPiece + (distanceToEndRowRight * 7)
  }

  //calculates starting row and index row for topRight
  let startingRowRight = Math.floor(startTopRight / 8)
  let indexRowRight = (startTopRight % 8)

  //creates the diagonal array for topLeft
  function topRightBottomLeft(){
    for(let i = startingRowRight; i < 8; i++){
      piecesRightLeft.push(rows[i][indexRowRight])
      if(indexRowRight === 0){
        return
      }
      indexRowRight--
    }
  }
  topRightBottomLeft()

  //within the diagonal array finds the nearest encounters
  function findFirstEncountersRightLeft(){
    let aheadArray = []
    let behindArray = []
    let finalArray = []
    let firstAhead, firstBehind

    for(let piece of piecesRightLeft){
      if(tilesArray.indexOf(piece) === indexPiece){
        continue
      }
      if(piece.hasChildNodes() && indexPiece > tilesArray.indexOf(piece)){
        aheadArray.push(tilesArray.indexOf(piece))
        firstAhead = Math.max(...aheadArray)
      }
      if(piece.hasChildNodes() && indexPiece < tilesArray.indexOf(piece)){
        behindArray.push(tilesArray.indexOf(piece))
        firstBehind = Math.min(...behindArray)
      }
    }

    //treating different cases
    if(!isNaN(firstAhead) && !isNaN(firstBehind)){   //Has pieces in front and behind
      for(let i = firstAhead; i < firstBehind + 1; i+=7){
        finalArray.push(tilesArray[i])
      }
    }
    if(isNaN(firstAhead) && !isNaN(firstBehind)){   //Only has pieces behind
      for(let x = startTopRight; x < firstBehind + 1; x+=7){
        finalArray.push(tilesArray[x])
      }
    }
    if(!isNaN(firstAhead) && isNaN(firstBehind)){   //Only has pieces in front
      for(let y = firstAhead; y < endTopRight + 1; y+=7){
        finalArray.push(tilesArray[y])
      }
    }
    if(isNaN(firstAhead) && isNaN(firstBehind)){    //Pieces neither behind or in
      for(let z = startTopRight; z < endTopRight + 1; z+=7){
        finalArray.push(tilesArray[z])
      }
    }

    //paiting and removing unnecessary tiles
    finalArray.forEach(tile =>{
      tile.classList.add('ondragstart')
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    }) 
  }
  findFirstEncountersRightLeft()
}
  //* QUEEN */
function queenMovement(event){
  let type = event.target.className
  if(type.includes('white')) color = 'white'
  else color = 'black'
  rookHorizontalMove(event)
  rookVerticalMove(event)
  bishopMovement(event)
}

  //* KING */
function kingMovement(event){
  let kingMovements = [-9,-8,-7,1,9,8,7,-1]
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className

  if(type.includes('white')) color = 'white'
  else color = 'black'

  if(isInFirstColumn(indexPiece)) kingMovements = [-1,-8,-9,8,7]
  if(isInEighthColumn(indexPiece)) kingMovements = [1,8,9,-8,-7]

  kingMovements.forEach(move => {
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
