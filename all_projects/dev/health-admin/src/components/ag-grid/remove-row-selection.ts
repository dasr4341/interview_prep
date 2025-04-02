import { GridApi } from '@ag-grid-community/core';

export function removeRowSelection(
  gridApiRef: GridApi | null | undefined,
  agGridRowId: string | null,
  matchId?: string
) {
  // unselecting the row
  if (gridApiRef && agGridRowId) {
    gridApiRef.getRowNode(agGridRowId)?.setSelected(false);
  } else if (gridApiRef && matchId) {
    gridApiRef?.forEachNode((node) => {
      if (node.data.id === matchId) {
        node.setSelected(false);
      }
    });
  }
}
