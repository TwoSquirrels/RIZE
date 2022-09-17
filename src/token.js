// SPDX-License-Identifier: MIT

const ACCESS_TOKEN_SHEET =
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ACCESS TOKEN");
const Column = {
  USER_ID: 1,
  DISPLAY_NAME: 2,
  ACCESS_TOKEN: 3,
  DEADLINE: 4,
};

function updateRizeTokenById(userId) {
  const lineName = fetchLineName(userId);
  const newRizeToken = Utilities.getUuid();
  const newDeadline = Date.now() + 1000 * 300000; // 5 分後
  const tableBottom = ACCESS_TOKEN_SHEET.getLastRow();
  if (tableBottom <= 1) {
    ACCESS_TOKEN_SHEET.appendRow([userId, lineName, newRizeToken, newDeadline]);
    return newRizeToken;
  }
  const table = ACCESS_TOKEN_SHEET.getSheetValues(2, 1, tableBottom - 1, 4);
  const rowIndex = table.findIndex((row) => row[Column.USER_ID] === userId);
  if (rowIndex === -1) {
    ACCESS_TOKEN_SHEET.appendRow([userId, lineName, newRizeToken, newDeadline]);
  } else {
    ACCESS_TOKEN_SHEET.getRange(rowIndex + 2, Column.ACCESS_TOKEN).setValue(
      newRizeToken
    );
    ACCESS_TOKEN_SHEET.getRange(rowIndex + 2, Column.DEADLINE).setValue(
      newDeadline
    );
  }
  return newRizeToken;
}

function updateRizeTokenByToken(token) {
  // TODO: update spreadsheet
}
