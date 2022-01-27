

//*PAWNgit 
function pawnMovement(event){
  let indexPiece = tilesArray.indexOf(event.target.parentNode)
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

function pawnFirstTurn(indexPiece){ //FIRST TURN
  if(checkCollision(normalMove - 1) && !tilesArray[normalMove - 1].firstChild.classList.contains(color)){   //if theres a piece within attack reach and has different color
    if(indexPiece % 8 === 0){ //multiples by 8
      tilesArray[normalMove - 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove - 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove + 1) && !tilesArray[normalMove + 1].firstChild.classList.contains(color)){
    if((indexPiece +1) % 8 === 0){  //non multiples by 8
      tilesArray[normalMove + 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove + 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove)){
    return
  }else{
    if(checkCollision(firstMove)){
      tilesArray[normalMove].classList.add('ondragstart')
    }else{
      tilesArray[normalMove].classList.add('ondragstart')
      tilesArray[firstMove].classList.add('ondragstart')  
    }
  }
  
}

function pawnNormalTurn(indexPiece){ //NORMAL TURN
  if(checkCollision(normalMove - 1) && !tilesArray[normalMove - 1].firstChild.classList.contains(color)){
    if(indexPiece % 8 === 0){ 
      tilesArray[normalMove - 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove - 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove + 1) && !tilesArray[normalMove + 1].firstChild.classList.contains(color)){
    if((indexPiece +1) % 8 === 0){
      tilesArray[normalMove + 1].classList.remove('ondragstart')
    }else{
      tilesArray[normalMove + 1].classList.add('ondragstart')
    }
  }
  if(checkCollision(normalMove)){ //checks if in front there's a piece 
    return
  }else{
    tilesArray[normalMove].classList.add('ondragstart')
  }
}

//checks if pawn has already moved
function isPawnFirstTurn(index){
  return piecesCounter.tiles[index] === 0 ? true : false
}

//checks if tile has a piece inside
function checkCollision(index){
  return tilesArray[index].hasChildNodes() ? true : false
}

function doSomething(){
    return 1
}
