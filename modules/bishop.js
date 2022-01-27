import * as util from './util.js'

//*BISHOP

export function bishopMovement(event){
  let indexPiece = util.tilesArray.indexOf(event.target.parentNode)
  let rowPos = Math.floor(indexPiece / 8)
  let indexRow = util.rows[rowPos].indexOf(event.target.parentNode)
  let type = event.target.className
  let piecesLeftRight = []
  let piecesRightLeft = []
  let color

  if(type.includes('white')) color = 'white'
  else color = 'black'

  /* **************** LEFT TO RIGHT ******************** */

  //calculates starting row and index row for topLeft
  let indexRowStartPointLeftRight = 0
  let startingPointTopLeft = rowPos - indexRow
  if(startingPointTopLeft < 0){
    startingPointTopLeft = 0
    indexRowStartPointLeftRight = indexRow - rowPos
  }

  //calculates starting tilesArray index for topLeft
  let ogIndexRow = indexRow
  if(indexRow > rowPos){
    indexRow = rowPos
  }
  let startTopLeft = ((rowPos * 8) + ogIndexRow) - (9 * indexRow)
  
  //calculates ending tilesArray index for topLeft
  let distanceToEndRow =  7 - ogIndexRow
  let endTopLeft = indexPiece + (9 * distanceToEndRow)
  if(endTopLeft > 63){
    distanceToEndRow = 7 - rowPos
    endTopLeft = indexPiece + (distanceToEndRow * 9)
  }

  //creates the diagonal array for topLeft
  function topLeftBottomRight(){
    for(let i = startingPointTopLeft; i < 8; i++){
      piecesLeftRight.push(util.rows[i][indexRowStartPointLeftRight])
      if(indexRowStartPointLeftRight === 7){
        return
      }
      indexRowStartPointLeftRight++
    }
  }
  topLeftBottomRight() 
 
  //within the diagonal array finds the nearest encounters
  function findFirstEncountersLeftRight(){
    let aheadArray = []
    let behindArray = []
    let finalArray = []
    let firstAhead, firstBehind

    for(let piece of piecesLeftRight){
      if(util.tilesArray.indexOf(piece) === indexPiece){
        continue
      }
      if(piece.hasChildNodes() && indexPiece > util.tilesArray.indexOf(piece)){
        aheadArray.push(util.tilesArray.indexOf(piece))
        firstAhead = Math.max(...aheadArray)
      }
      if(piece.hasChildNodes() && indexPiece < util.tilesArray.indexOf(piece)){
        behindArray.push(util.tilesArray.indexOf(piece))
        firstBehind = Math.min(...behindArray)
      }
    }

    //treating different cases
    if(!isNaN(firstAhead) && !isNaN(firstBehind)){   //Has pieces in front and behind
      for(let i = firstAhead; i < firstBehind + 1; i+=9){
        finalArray.push(util.tilesArray[i])
      }
    }
    if(isNaN(firstAhead) && !isNaN(firstBehind)){   //Only has pieces behind
      for(let x = startTopLeft; x < firstBehind + 1; x+=9){
        finalArray.push(util.tilesArray[x])
      }
    }
    if(!isNaN(firstAhead) && isNaN(firstBehind)){   //Only has pieces in front
      for(let y = firstAhead; y < endTopLeft + 1; y+=9){
        finalArray.push(util.tilesArray[y])
      }
    }
    if(isNaN(firstAhead) && isNaN(firstBehind)){    //Pieces neither behind or in 
      for(let z = startTopLeft; z < endTopLeft + 1; z+=9){
        finalArray.push(util.tilesArray[z])
      }
    }

    //paiting and removing unnecessary tiles
    finalArray.forEach(tile =>{
      tile.classList.add('ondragstart')
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    }) 
  }
  findFirstEncountersLeftRight()

  /* **************** RIGHT TO LEFT ******************** */

  //calculates starting tilesArray index for topRight
  let startTopRight = indexPiece - ((7 - ogIndexRow) * 7)
  if(startTopRight < 0){
    startTopRight = indexPiece - (rowPos * 7)
  }

  //calculates ending tilesArray index for topRight
  let distanceToEndRowRight = ogIndexRow
  let endTopRight = indexPiece + (7 * distanceToEndRowRight)
  if(endTopRight > 63){
    distanceToEndRowRight = 7 - rowPos
    endTopRight = indexPiece + (distanceToEndRowRight * 7)
  }

  //calculates starting row and index row for topRight
  let startingRowRight = Math.floor(startTopRight / 8)
  let indexRowRight = (startTopRight % 8)

  //creates the diagonal array for topLeft
  function topRightBottomLeft(){
    for(let i = startingRowRight; i < 8; i++){
      piecesRightLeft.push(util.rows[i][indexRowRight])
      if(indexRowRight === 0){
        return
      }
      indexRowRight--
    }
  }
  topRightBottomLeft()

  //within the diagonal array finds the nearest encounters
  function findFirstEncountersRightLeft(){
    let aheadArray = []
    let behindArray = []
    let finalArray = []
    let firstAhead, firstBehind

    for(let piece of piecesRightLeft){
      if(util.tilesArray.indexOf(piece) === indexPiece){
        continue
      }
      if(piece.hasChildNodes() && indexPiece > util.tilesArray.indexOf(piece)){
        aheadArray.push(util.tilesArray.indexOf(piece))
        firstAhead = Math.max(...aheadArray)
      }
      if(piece.hasChildNodes() && indexPiece < util.tilesArray.indexOf(piece)){
        behindArray.push(util.tilesArray.indexOf(piece))
        firstBehind = Math.min(...behindArray)
      }
    }

    //treating different cases
    if(!isNaN(firstAhead) && !isNaN(firstBehind)){   //Has pieces in front and behind
      for(let i = firstAhead; i < firstBehind + 1; i+=7){
        finalArray.push(util.tilesArray[i])
      }
    }
    if(isNaN(firstAhead) && !isNaN(firstBehind)){   //Only has pieces behind
      for(let x = startTopRight; x < firstBehind + 1; x+=7){
        finalArray.push(util.tilesArray[x])
      }
    }
    if(!isNaN(firstAhead) && isNaN(firstBehind)){   //Only has pieces in front
      for(let y = firstAhead; y < endTopRight + 1; y+=7){
        finalArray.push(util.tilesArray[y])
      }
    }
    if(isNaN(firstAhead) && isNaN(firstBehind)){    //Pieces neither behind or in
      for(let z = startTopRight; z < endTopRight + 1; z+=7){
        finalArray.push(util.tilesArray[z])
      }
    }

    //paiting and removing unnecessary tiles
    finalArray.forEach(tile =>{
      tile.classList.add('ondragstart')
      if(tile.hasChildNodes() && tile.firstChild.classList.contains(color)){
        tile.classList.remove('ondragstart')
      }
    }) 
  }
  findFirstEncountersRightLeft()
}