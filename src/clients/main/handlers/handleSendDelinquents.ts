import { Client, MessageEmbed } from "discord.js";
import fetchTextChannel from "../../actions/fetchChannel";
import fetchGuild from "../../actions/fetchGuild";

const CHANNEL_ID = process.env.MODSCHANNELID;

const WM_ROLE_ID = process.env.WM_ROLE_ID;
const MECO_ROLE_ID = process.env.MECO_ROLE_ID;
const OFN_ROLE_ID = process.env.OFN_ROLE_ID;
const BOT_ROLE_ID = process.env.BOT_ROLE_ID;
const HOST_ROLE_ID = process.env.HOST_ROLE_ID;

export default async function handleSendDelinquents(client: Client) {
  const guild = fetchGuild(client);
  const guildMemberManager = guild.members;

  // Gather Data
  const totalUserCount = guildMemberManager.cache.size;
  const allUsers = await guildMemberManager.list({ limit: 1000 });

  const delinquents = allUsers.filter((member) => {
    const hasWMrole = member.roles.cache.has(WM_ROLE_ID);
    const hasMECOrole = member.roles.cache.has(MECO_ROLE_ID);
    const hasOFNrole = member.roles.cache.has(OFN_ROLE_ID);
    const isABot = member.roles.cache.has(BOT_ROLE_ID);
    const isHost = member.roles.cache.has(HOST_ROLE_ID);
    return !hasWMrole && !hasMECOrole && !hasOFNrole && !isABot && !isHost;
  });

  const embed = new MessageEmbed({
    title: "Delinquents",
    description:
      "These are the members who do not have requisite roles in Discord.",
    fields: [
      {
        name: "Total",
        value: `${delinquents.size} deliquent users of ${totalUserCount} total users`,
      },
      {
        name: "List",
        value: delinquents.map((user) => user.displayName).join("\n"),
      },
    ],
  });

  const channel = await fetchTextChannel(client, CHANNEL_ID);
  channel.send({ embeds: [embed] });
}
