// SPDX-License-Identifier: MIT

const PROPERTIES = PropertiesService.getScriptProperties();

function doGet(requestEvent) {
  return;
}

function doPost(requestEvent) {
  const request = JSON.parse(requestEvent.postData?.contents ?? "null");
  try {
    switch (requestEvent.pathInfo) {
      case "line":
        if (request.destination !== PROPERTIES.getProperty("LINE_ID")) {
          throw new Error("Invalid LINE BOT User Id.");
        }
        // LINE
        request.events.forEach((event) => {
          if (event.type !== "message") return;
          if (event.mode !== "active") return;
          if (event.source.type !== "user") return;
          const rizeToken = updateRizeTokenById(event.source.userId);
          replyLINE(event.replyToken, `https://uchikoshi-fes.jp/rize?token=${rizeToken}`);
        });
        return ContentService.createTextOutput("DONE!");
      case "rize":
        const rizeToken = updateRizeTokenByToken(request.rizeToken);
        // TODO: rize system
        throw new Error("Now developing.");
      default:
        throw new Error("Invalid path.");
    }
  } catch (error) {
    const response = ContentService.createTextOutput(JSON.stringify({ error: error.message }));
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
}
