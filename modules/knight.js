import * as util from './util.js'

  //* KNIGHT */
export function knightMovement(event){
  let knightMovements = [-17,-15,-10,-6,6,10,15,17]
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
  let type = event.target.className
  let color 

  if(type.includes('white')) color = 'white'
  else color = 'black'

  //Necessary in order to avoid unwanted movements to the other extreme of the board
  if(isInFirstColumn(indexPiece)) knightMovements = [-17,-10,6,15]
  if(isInSecondColumn(indexPiece)) knightMovements = [-17,-15,-10,6,15,17]
  if(isInSeventhColumn(indexPiece)) knightMovements = [-17,-15,-6,10,15,17]
  if(isInEighthColumn(indexPiece)) knightMovements = [-15,-6,10,17]
  
  knightMovements.forEach(move => {
    if(!isOutOfBounds(indexPiece - move)){
      util.tilesArray[indexPiece - move].classList.add('ondragstart')
    }
    util.tilesArray.forEach(tile => {
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    })  
  })
}

//switch statements are slightly more efficient than ifs statements (0,008 ms vs 0,005)
export function isInSecondColumn(position){
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

export function isInFirstColumn(position){
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

export function isInSeventhColumn(position){
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

export function isInEighthColumn(position){
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

export function isOutOfBounds(movement){
  return movement > 63 || movement < 0 ? true : false
}