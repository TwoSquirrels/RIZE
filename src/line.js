// SPDX-License-Identifier: MIT

function replyLINE(replyToken, text) {
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    payload: JSON.stringify({ replyToken, messages: [{ type: "text", text }] }),
    myamethod: "POST",
    headers: { Authorization : `Bearer ${PROPERTIES.getProperty("LINE_TOKEN")}` },
    contentType: "application/json",
  });
}

function getLINEName(userId) {
  const response = JSON.parse(
    UrlFetchApp.fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
      myamethod: "GET",
      headers: { Authorization : `Bearer ${PROPERTIES.getProperty("LINE_TOKEN")}` },
      contentType: "application/json",
    }).getContentText()
  );
  return response.displayName;
}
