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
  const rowIndex = table.findIndex((row) => row[Column.USER_ID - 1] == userId);
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
  return { displayName: lineName, rizeToken: newRizeToken };
}

function updateRizeTokenByToken(token) {
  const tableBottom = ACCESS_TOKEN_SHEET.getLastRow();
  if (tableBottom <= 1) throw new Error("No token found.");
  const table = ACCESS_TOKEN_SHEET.getSheetValues(2, 1, tableBottom - 1, 4);
  const rowIndex = table.findIndex(
    (row) => row[Column.ACCESS_TOKEN - 1] == token
  );
  if (rowIndex === -1) throw new Error("No token found.");
  const userId = table[rowIndex][Column.USER_ID - 1];
  const displayName = table[rowIndex][Column.DISPLAY_NAME - 1];
  const newRizeToken = Utilities.getUuid();
  const newDeadline = Date.now() + 1000 * 600000; // 10 分後
  ACCESS_TOKEN_SHEET.getRange(rowIndex + 2, Column.ACCESS_TOKEN).setValue(
    newRizeToken
  );
  ACCESS_TOKEN_SHEET.getRange(rowIndex + 2, Column.DEADLINE).setValue(
    newDeadline
  );
  return { userId, displayName, rizeToken: newRizeToken };
}
