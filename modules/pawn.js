import * as util from './util.js'

  // *PAWN */

let firstMove
let normalMove
let color

export function pawnMovement(event){
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

export function pawnFirstTurn(indexPiece){ //FIRST TURN
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

export function pawnNormalTurn(indexPiece){ //NORMAL TURN
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
export function isPawnFirstTurn(index){
  return util.piecesCounter.tiles[index] === 0 ? true : false
}

//checks if tile has a piece inside
export function checkCollision(index){
  return util.tilesArray[index].hasChildNodes() ? true : false
}
