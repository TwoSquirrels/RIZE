// SPDX-License-Identifier: MIT

const PROPERTIES = PropertiesService.getScriptProperties();

function doGet(requestEvent) {
  return;
}

function doPost(requestEvent) {
  const request = JSON.parse(requestEvent.postData?.contents ?? "null");
  try {
    switch (requestEvent.parameter?.method) {
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
          replyLINE(
            event.replyToken,
            "トークンを発行しました。\n" +
              "↓ トークン付き URL\n" +
              `https://uchikoshi-fes.jp/rize?token=${rizeToken}\n` +
              "5 分後にこのトークンは無効となります。"
          );
        });
        return ContentService.createTextOutput('"DONE!"');
      case "rize":
        const rizeToken = updateRizeTokenByToken(request.rizeToken);
        // TODO: rize system
        throw new Error("Now developing.");
      default:
        throw new Error("Invalid method.");
    }
  } catch (error) {
    logDiscord(`Error: ${error.message}`);
    const response = ContentService.createTextOutput(
      JSON.stringify({ error: error.message })
    );
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
}

function logDiscord(text) {
  const discordWebhookUrl = PROPERTIES.getProperty("DISCORD_WEBHOOK_URL");
  if (!discordWebhookUrl) return;
  const payload = {
    username: "RIZE Logger",
    content: text,
  };
  UrlFetchApp.fetch(discordWebhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
  });
}
