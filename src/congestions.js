// SPDX-License-Identifier: MIT

const CONGESTIONS_SHEET =
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("CONGESTIONS");
const Column = {
  ORGANIZATION_ID: 1,
  UPDATED_AT: 2,
  UPDATED_BY: 3,
  CONGESTION: 4,
};

function getCongestions(moderator = false) {
  const rows = CONGESTIONS_SHEET.getDataRange().getValues();
  const congestions = rows.slice(1).map((row) => {
    return {
      organizationId: row[Column.ORGANIZATION_ID - 1],
      updatedAt: row[Column.UPDATED_AT - 1],
      updatedBy: moderator ? row[Column.UPDATED_BY - 1] : undefined,
      congestion: row[Column.CONGESTION - 1],
    };
  });
  return congestions;
}

function updateCongestion(displayName, organizationId, congestion) {
  const congestions = getCongestions(true);
  return congestions;
}
