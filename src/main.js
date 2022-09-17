// SPDX-License-Identifier: MIT

const PROPERTIES = PropertiesService.getScriptProperties();

function doGet(requestEvent) {
  try {
    let moderator = null;
    if (requestEvent.parameter?.rizeToken) {
      moderator = updateRizeTokenByToken(requestEvent.parameter.rizeToken);
    }
    const congestions = getCongestions(moderator !== null);
    return ContentService.createTextOutput(
      JSON.stringify({
        rizeToken: moderator?.rizeToken ?? undefined,
        displayName: moderator?.displayName ?? undefined,
        congestions,
      })
    );
  } catch (error) {
    const response = ContentService.createTextOutput(
      JSON.stringify({ error: error.message })
    );
    response.setMimeType(ContentService.MimeType.JSON);
    return response;
  }
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
          const { displayName, rizeToken } = updateRizeTokenById(
            event.source.userId
          );
          replyLINE(
            event.replyToken,
            `${displayName} さん専用のアクセストークンを発行しました。\n` +
              "↓ アクセストークン付き URL\n" +
              `https://uchikoshi-fes.jp/rize?token=${rizeToken}\n` +
              "5 分後にこのトークンは無効となります。"
          );
        });
        return ContentService.createTextOutput('"DONE!"');
      case "rize":
        const { displayName, rizeToken } = updateRizeTokenByToken(
          request.rizeToken
        );
        if (typeof request.organizationId !== "string")
          throw new Error("Invalid organizationId.");
        if (
          typeof request.congestions !== -1 &&
          typeof request.congestions !== 0 &&
          typeof request.congestions !== 1
        )
          throw new Error("Invalid congestions.");
        const congestions = updateCongestion(
          displayName,
          request.organizationId,
          request.congestion
        );
        return ContentService.createTextOutput(
          JSON.stringify({ rizeToken, displayName, congestions })
        );
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
