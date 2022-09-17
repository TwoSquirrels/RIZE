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
  const rows = ACCESS_TOKEN_SHEET.getDataRange().getValues();
  const rowNumber =
    rows.slice(1).findIndex((row) => row[Column.USER_ID - 1] == userId) + 2;
  if (rowNumber === 1) {
    ACCESS_TOKEN_SHEET.appendRow([userId, lineName, newRizeToken, newDeadline]);
  } else {
    ACCESS_TOKEN_SHEET.getRange(rowNumber, Column.ACCESS_TOKEN).setValue(
      newRizeToken
    );
    ACCESS_TOKEN_SHEET.getRange(rowNumber, Column.DEADLINE).setValue(
      newDeadline
    );
  }
  return { displayName: lineName, rizeToken: newRizeToken };
}

function updateRizeTokenByToken(token) {
  const rows = ACCESS_TOKEN_SHEET.getDataRange().getValues();
  const rowNumber =
        rows.slice(1).findIndex((row) => row[Column.ACCESS_TOKEN - 1] == token) + 2;
  if (rowNumber === 1) throw new Error("Invalid token.");
  const userId = rows[rowNumber - 1][Column.USER_ID - 1];
  const displayName = rows[rowNumber - 1][Column.DISPLAY_NAME - 1];
  const newRizeToken = Utilities.getUuid();
  const newDeadline = Date.now() + 1000 * 600000; // 10 分後
  ACCESS_TOKEN_SHEET.getRange(rowNumber, Column.ACCESS_TOKEN).setValue(
    newRizeToken
  );
  ACCESS_TOKEN_SHEET.getRange(rowNumber, Column.DEADLINE).setValue(
    newDeadline
  );
  return { userId, displayName, rizeToken: newRizeToken };
}
