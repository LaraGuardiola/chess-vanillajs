import * as util from './modules/util.js'
import * as events from './modules/events.js'

util.tiles.forEach(() =>{
  util.setEvent('click', cleanBoard,false) //workaround to fix multiple backgrounds if dragged piece is returned to its original place 
  util.setEvent('dragstart', events.ondragstart, false)
  util.setEvent('touchstart',events.ondragstart, false)
  util.setEvent('dragover', events.ondragover, false)
  util.setEvent('dragleave', events.ondragleave, false)
  util.setEvent('drop', events.ondrop, false)
})

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


