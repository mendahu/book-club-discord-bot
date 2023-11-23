import { Client } from "discord.js";
import mcconfig from "../../mcconfig";
import bootLogger from "../../logger";
import { LogStatus } from "../../logger/Logger";

export enum EventBotEvents {
  START = "eventStarted",
  END = "eventEnded",
  RETRIEVED = "eventsRetrieved",
  NEW_TITLE = "newStreamTitle",
  VIEW_TITLES = "viewStreamTitles",
}

const eventsBot = new Client({
  intents: [
    mcconfig.discord.intents.simpleIntents,
    mcconfig.discord.intents.eventIntents,
  ],
});

// Handlers
eventsBot.on("error", console.error);
eventsBot.once("ready", () => {
  bootLogger.addLog(LogStatus.SUCCESS, "Event Bot ready");
  bootLogger.logItemSuccess("eventsBot");
});

eventsBot.login(mcconfig.discord.clients.events.token);

export default eventsBot;
