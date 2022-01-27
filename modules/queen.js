import * as rook from './rook.js'
import * as bishop from './bishop.js'
  
  //* QUEEN */

export function queenMovement(event){
  let type = event.target.className
  let color
  
  if(type.includes('white')) color = 'white'
  else color = 'black'
  rook.rookHorizontalMove(event)
  rook.rookVerticalMove(event)
  bishop.bishopMovement(event)
}