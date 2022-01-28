import * as util from './util.js'
import * as events from './events.js'

//* UI FUNCTIONS */

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
  events.lastMovedStartPos.style.removeProperty("border")
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