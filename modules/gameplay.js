import * as util from './util.js'
import * as pawn from './pawn.js'
import * as rook from './rook.js'
import * as knight from './knight.js'
import * as bishop from './bishop.js'
import * as queen from './queen.js'
import * as king from './king.js'

/* GAMEPLAY FUNCTIONS */

export function checkPiece(event){ 
    if(isPawn(event)) pawn.pawnMovement(event)
    if(isRook(event)) rook.rookMovement(event)
    if(isKnight(event)) knight.knightMovement(event)
    if(isBishop(event)) bishop.bishopMovement(event)
    if(isQueen(event)) queen.queenMovement(event,util.color)
    if(isKing(event)) king.kingMovement(event)
  }
  
  export function isPawn(event){
    return event.target.classList.contains('pawn') ? true : false
  }
  
  export function isRook(event){
    return event.target.classList.contains('tower') ? true : false
  }
  
  export function isKnight(event){
    return event.target.classList.contains('knight') ? true : false
  }
  
  export function isBishop(event){
    return event.target.classList.contains('bishop') ? true : false
  }
  
  export function isQueen(event){
    return event.target.classList.contains('queen') ? true : false
  }
  
  export function isKing(event){
    return event.target.classList.contains('king') ? true : false
  }