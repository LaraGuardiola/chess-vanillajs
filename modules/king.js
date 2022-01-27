import * as util from './util.js'
import * as knight from './knight.js'

//* KING */

export function kingMovement(event){
  let kingMovements = [-9,-8,-7,1,9,8,7,-1]
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className
  let color

  if(type.includes('white')) color = 'white'
  else color = 'black'

  if(knight.isInFirstColumn(indexPiece)) kingMovements = [-1,-8,-9,8,7]
  if(knight.isInEighthColumn(indexPiece)) kingMovements = [1,8,9,-8,-7]

  kingMovements.forEach(move => {
    if(!knight.isOutOfBounds(indexPiece - move)){
      util.tilesArray[indexPiece - move].classList.add('ondragstart')
    }
    util.tilesArray.forEach(tile => {
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    })  
  })
}