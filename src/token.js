// SPDX-License-Identifier: MIT

function updateRizeTokenById(userId) {
  const lineName = getLINEName(userId);
  const newRizeToken = Utilities.getUuid();
  // TODO: update spreadsheet
  return newRizeToken;
}

function updateRizeTokenByToken(token) {
  // TODO: update spreadsheet
}
