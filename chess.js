import * as util from './modules/util.js'
import * as pawn from './modules/pawn.js'
import * as rook from './modules/rook.js'
import * as knight from './modules/knight.js'
import * as bishop from './modules/bishop.js'
import * as queen from './modules/queen.js'
import * as king from './modules/king.js'

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
  if(isKing(event)) king.kingMovement(event)
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

  //* QUEEN 
  let color
function queenMovement(event){
  
  let type = event.target.className
  if(type.includes('white')) color = 'white'
  else color = 'black'
  rook.rookHorizontalMove(event,color)
  rook.rookVerticalMove(event,color)
  bishop.bishopMovement(event,color)
}
/*
  /KING 
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
*/