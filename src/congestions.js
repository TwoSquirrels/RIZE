// SPDX-License-Identifier: MIT

const CONGESTION_SHEET =
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONGESTION");
const CongestionColumn = {
  ORGANIZATION_ID: 1,
  UPDATED_AT: 2,
  UPDATED_BY: 3,
  CONGESTION: 4,
};

function getCongestions(moderator = false) {
  const rows = CONGESTION_SHEET.getDataRange().getValues();
  const congestions = rows.slice(1).map((row) => {
    return {
      organizationId: row[CCongestionolumn.ORGANIZATION_ID - 1],
      updatedAt: row[CongestionColumn.UPDATED_AT - 1],
      updatedBy: moderator ? row[CongestionColumn.UPDATED_BY - 1] : undefined,
      congestion: row[CongestionColumn.CONGESTION - 1],
    };
  });
  return congestions;
}

function updateCongestion(displayName, organizationId, congestion) {
  const congestions = getCongestions(true);
  let rowNumber =
    congestions
      .slice(1)
      .findIndex(
        (row) => row[CongestionColumn.ORGANIZATION_ID - 1] == organizationId
      ) + 2;
  if (rowNumber === 1) {
    congestions.push([]);
    rowNumber = congestions.length + 1;
  }
  congestions[rowNumber - 2][CongestionColumn.UPDATED_AT - 1] = Date.now();
  congestions[rowNumber - 2][CongestionColumn.UPDATED_BY - 1] = displayName;
  congestions[rowNumber - 2][CongestionColumn.CONGESTION - 1] = congestion;
  CONGESTION_SHEET.getRange(rowNumber, 1, 1, 4).setValues([
    congestions[rowNumber - 2],
  ]);
  return congestions;
}
