import * as util from './util.js'
import * as gameplay from './gameplay.js'

//*EVENTS

//* DRAG AND DROP FUNCTIONS

let lastMovedStartPos
let dragged
let lastMovedEndPos

export function ondragstart(event){
  cleanTiles()
  gameplay.checkPiece(event)
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

export function ondragover(event){
  event.preventDefault()
  if(event.target.classList.contains('ondragstart') || event.target.parentNode.classList.contains('ondragstart')){ //movement possible if tile has ondragstart or span's father has it
    event.dataTransfer.dropEffect = "all"  //drop it
  }else{ 
    event.dataTransfer.dropEffect = "none" // dropping is not allowed
  }
  //event.target.classList.add("ondragover")   
}

export function ondragleave(event){
  event.preventDefault()
  event.target.classList.remove("ondragover")
}

export function ondrop(event){
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

//* UI FUNCTIONS 

export function changeTurn(event){
  util.pieces.forEach(piece => {
    let draggableToggle = piece.getAttribute("draggable") === 'true' ? 'false' : 'true'
    piece.setAttribute('draggable',draggableToggle)
  })
  util.piecesCounter.addPieceTurn(util.tilesArray.indexOf(event.target)) //add 1 to the counter meaning pawn has already moved at least once
  setStylesForNextTurn(event)
  updateTurnSections()
}

export function setStylesForNextTurn(event){
  let lastMovedEndPos = event.target
	lastMovedEndPos.classList.remove("ondragover")
  lastMovedEndPos.style.border = "3px solid black"
  lastMovedStartPos.style.removeProperty("border")
}

export function updateTurnSections(){
  if(whiteSection.style.display === "none" && blackSection.style.display === "block"){
    whiteSection.style.display = "block"
    blackSection.style.display = "none"
  }else{
    whiteSection.style.display = "none"
    blackSection.style.display = "block"
  }
}

export function cleanBoard(){
  util.tilesArray.forEach(tile =>{
    if(tile.classList.contains("ondragstart")){
      tile.classList.remove("ondragstart")
    }
    if(tile.style.border === "3px solid black"){
      tile.style.removeProperty('border')
    }
  })
}

export function cleanTiles(){
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