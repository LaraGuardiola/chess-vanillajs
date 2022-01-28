import * as util from './modules/util.js'
import * as events from './modules/events.js'
import * as ui from './modules/ui.js'

util.tiles.forEach(() =>{
  util.setEvent('click', ui.cleanBoard,false) 
  util.setEvent('dragstart', events.ondragstart, false)
  util.setEvent('dragover', events.ondragover, false)
  util.setEvent('drop', events.ondrop, false)
})


