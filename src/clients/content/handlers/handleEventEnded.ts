import { ChannelType, Client, GuildScheduledEvent } from "discord.js";
import { Feed, FeedList } from "../../..";
import createUniqueResultEmbed from "../actions/createUniqueResultEmbed";
import mcconfig from "../../../mcconfig";

export default async function handleEventEnded(
  event: GuildScheduledEvent,
  client: Client,
  feeds: FeedList
) {
  const offNomEpisode = feeds[Feed.OFF_NOMINAL_YOUTUBE].getEpisodeByUrl(
    event.entityMetadata.location
  );
  const happyHourEpisode = feeds[Feed.HAPPY_HOUR].getEpisodeByUrl(
    event.entityMetadata.location
  );

  const episode = offNomEpisode || happyHourEpisode;

  if (!episode) {
    return;
  }

  const embed = createUniqueResultEmbed(episode);
  try {
    const channel = await client.channels.fetch(
      mcconfig.discord.channels.content
    );

    if (channel.type !== ChannelType.GuildAnnouncement) return;
    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error(err);
  }
}
