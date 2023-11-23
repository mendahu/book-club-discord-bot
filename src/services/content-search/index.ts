import { BaseInteraction, InteractionReplyOptions } from "discord.js";
import { Providers } from "../../providers";
import rssProviders from "../../providers/rss-providers";
import { ContentListener } from "../../providers/rss-providers/ContentListener";
import { createSearchResultsEmbed } from "./createSearchResultsEmbed";
import createUniqueResultEmbed from "../../actions/create-unique-result-embed";

export default function ContentSearch({ contentBot }: Providers) {
  contentBot.on("interactionCreate", (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const { options } = interaction;
    const subCommand = options.getSubcommand(false);
    const show = options.getString("show", true);

    if (show === "news") {
      interaction.reply({
        content: "The `/content search` command does not work for news.",
      });
      return;
    }

    if (!(show in rssProviders)) {
      interaction.reply({
        content: "No show with that name.",
      });
      return;
    }

    const feedListener = rssProviders[show] as ContentListener;

    const returnMessage: InteractionReplyOptions = {
      embeds: [],
    };

    if (subCommand === "search") {
      const term = options.getString("term");
      const results = feedListener.search(term).slice(0, 3);
      returnMessage.embeds.push(
        createSearchResultsEmbed(
          results,
          feedListener.title,
          feedListener.albumArt,
          term
        )
      );
    }

    if (subCommand === "recent") {
      const episode = feedListener.fetchRecent();
      returnMessage.embeds.push(createUniqueResultEmbed(episode));
    }

    if (subCommand === "episode-number") {
      const epNum = options.getInteger("episode-number");
      const episode = feedListener.getEpisodeByNumber(epNum);
      if (episode) {
        returnMessage.embeds.push(createUniqueResultEmbed(episode));
      } else {
        returnMessage.content = "No episode with that number.";
      }
    }

    interaction.reply(returnMessage);
  });
}
