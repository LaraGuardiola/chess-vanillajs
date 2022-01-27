import * as util from './util.js'
  
  //* ROOK */

//checks if inside the tiles of a row there's a piece
export function checkRowCollision(rowIndex,index){
  return util.rows[rowIndex][index].hasChildNodes() ? true : false
}

//checks if inside the tiles of a column there's a piece
export function checkColumnCollision(arrayColumn,index){
  return arrayColumn[index].hasChildNodes() ? true : false
}

export function createRows(arr, numGroups) {
  const perGroup = Math.ceil(arr.length / numGroups)   //in this case, 8 per group (8x8 = 64 tiles)
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
}

export function getColumn(event){
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = util.rows[rowPos].indexOf(event.target.parentNode)
  let column = []

  if(column.length === 8){ //without this, every time you drag the piece it keeps pushing
    return
  }else{
    for(let row of util.rows){
      column.push(row[indexRow])
    }
    return column
  }
}

export function rookMovement(event){
  let type = event.target.className
  let color
  if(type.includes('white')) color = 'white'
  else color = 'black'
  rookHorizontalMove(event,color)
  rookVerticalMove(event,color)
}

export function printMovementTiles(movementArray){
  movementArray.forEach(tile => {
    if(!tile.hasChildNodes()){
      tile.classList.add('ondragstart')
    }
  })
}

export function rookHorizontalMove(event,color){
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let row = util.rows[rowPos]
  let indexRow = util.rows[rowPos].indexOf(event.target.parentNode)
  let nonEmptySpaces = []

  for (let i = 0; i < row.length; i++) { //returns an array with the indexes where pieces are placed
    if (row[i].hasChildNodes())
        nonEmptySpaces.push(i);
  }

  let pieceRelativeToOthers = nonEmptySpaces.indexOf(indexRow) //gives index position for the array of pieces
  let movementArray = []

  if (pieceRelativeToOthers === 0)
    movementArray = row.slice(0, nonEmptySpaces[pieceRelativeToOthers + 1])
  else {
    movementArray = row.slice(nonEmptySpaces[pieceRelativeToOthers - 1] + 1, nonEmptySpaces[pieceRelativeToOthers + 1])
  }

  let distanceBetweenLeft = nonEmptySpaces[pieceRelativeToOthers] - nonEmptySpaces[pieceRelativeToOthers - 1]
  let distanceBetweenRight = nonEmptySpaces[pieceRelativeToOthers + 1] - nonEmptySpaces[pieceRelativeToOthers]

  if(isNaN(distanceBetweenLeft)){ //otherwise index could be less than 0, giving error
    distanceBetweenLeft = 0
  }
  if(isNaN(distanceBetweenRight)){ //like before, if index is out of bound is going to return an error
    distanceBetweenRight = 0
  }
  if(checkRowCollision(rowPos, indexRow - distanceBetweenLeft) && !util.tilesArray[indexPiece - distanceBetweenLeft].firstChild.classList.contains(color)){
    util.tilesArray[indexPiece - distanceBetweenLeft].classList.add('ondragstart')
  }
  if(checkRowCollision(rowPos, indexRow + distanceBetweenRight) && !util.tilesArray[indexPiece + distanceBetweenRight].firstChild.classList.contains(color)){
    util.tilesArray[indexPiece + distanceBetweenRight].classList.add('ondragstart')
  }
  printMovementTiles(movementArray)
}

export function rookVerticalMove(event,color){
  let column = getColumn(event)
  let nonEmptySpaces = []
  let indexColumn = column.indexOf(event.target.parentNode)

  for (let i = 0; i < column.length; i++) { 
    if (column[i].hasChildNodes())
        nonEmptySpaces.push(i);
  }

  let pieceRelativeOthers = nonEmptySpaces.indexOf(indexColumn) //gives index position for the array of pieces
  let movementArray = []

  if (pieceRelativeOthers === 0)
    movementArray = column.slice(0, nonEmptySpaces[pieceRelativeOthers + 1])
  else {
    movementArray = column.slice(nonEmptySpaces[pieceRelativeOthers - 1] + 1, nonEmptySpaces[pieceRelativeOthers + 1])
  }

  let distanceBetweenLeft = nonEmptySpaces[pieceRelativeOthers] - nonEmptySpaces[pieceRelativeOthers - 1]
  let distanceBetweenRight = nonEmptySpaces[pieceRelativeOthers + 1] - nonEmptySpaces[pieceRelativeOthers]

  if(isNaN(distanceBetweenLeft)){ //otherwise index could be less than 0, giving error
    distanceBetweenLeft = 0
  }
  if(isNaN(distanceBetweenRight)){ //like before, if index is out of bound is going to return an error
    distanceBetweenRight = 0
  }
  if(checkColumnCollision(column, indexColumn - distanceBetweenLeft) && !column[indexColumn - distanceBetweenLeft].firstChild.classList.contains(color)){
    column[indexColumn - distanceBetweenLeft].classList.add('ondragstart')
  }
  if(checkColumnCollision(column, indexColumn + distanceBetweenRight) && !column[indexColumn + distanceBetweenRight].firstChild.classList.contains(color)){
    column[indexColumn + distanceBetweenRight].classList.add('ondragstart')
  }
  printMovementTiles(movementArray)
}