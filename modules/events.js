import * as util from './util.js'
import * as gameplay from './gameplay.js'
import * as ui from './ui.js'

//*EVENTS

//* DRAG AND DROP FUNCTIONS

export let lastMovedStartPos
let dragged
let lastMovedEndPos

export function ondragstart(event){
  ui.cleanTiles()
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
  ui.cleanBoard()
  ui.changeTurn(event) 
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