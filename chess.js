import * as util from './modules/util.js'
import * as pawn from './modules/pawn.js'
import * as rook from './modules/rook.js'
import * as knight from './modules/knight.js'

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
  if(isPawn(event)) pawn.pawnMovement(event)
  if(isRook(event)) rook.rookMovement(event)
  if(isKnight(event)) knight.knightMovement(event)
  if(isBishop(event)) bishop.bishopMovement(event)
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
/*


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
