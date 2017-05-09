export function insertAdjacent(transform, insert, adjacentTo, indexOffset = 1) {
  const parent = transform.state.document.getParent(adjacentTo.key)
  const index = parent.nodes.findIndex(n => n === adjacentTo)
  return transform.insertNodeByKey(parent.key, index + indexOffset, insert)
}

export function insertBefore(transform, insert, adjacentTo) {
  return insertAdjacent(transform, insert, adjacentTo, 0)
}

export function insertAfter(transform, insert, adjacentTo) {
  return insertAdjacent(transform, insert, adjacentTo, 1)
}


export function insertAdjacentAndMoveTo(transform, insert, adjacentTo, indexOffset = 1) {
  return insertAdjacent(transform, insert, adjacentTo, indexOffset)
    .collapseToStartOf(insert)
    .moveOffsetsTo(0)
}

export function insertAfterAndMoveTo(transform, insert, adjacentTo) {
  return insertAdjacentAndMoveTo(transform, insert, adjacentTo, 1)
}

export function insertBeforeAndMoveTo(transform, insert, adjacentTo) {
  return insertAdjacentAndMoveTo(transform, insert, adjacentTo, 0)
}
