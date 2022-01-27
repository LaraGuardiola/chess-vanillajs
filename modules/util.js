
//*UTILS

export let borderFlag = []
export let firstMove, normalMove //pawn
export let tiles = document.querySelectorAll('.box')
export let tilesArray = [].slice.call(tiles) //as an array you can get access to indexOf method
export let rows = createRows(tilesArray,8)
export let pieces = document.querySelectorAll('.piece')
export let blackSection = document.querySelector('#blackSection')
export let whiteSection = document.querySelector('#whiteSection')
export let piecesCounter = { //useful to check if pawns have moved or not
  tiles : tilesArray.map(() => 0),
  addPieceTurn : index => {
    piecesCounter.tiles[index]++
  }
}
export const ondragstartTiles = {
  counter: [],
  lengths: []
}
export let setEvent = (...args) => tiles.forEach(tile => tile.addEventListener(...args));

export function createRows(arr, numGroups) {
    const perGroup = Math.ceil(arr.length / numGroups)   //in this case, 8 per group (8x8 = 64 tiles)
    return new Array(numGroups)
      .fill('')
      .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup))
  }
