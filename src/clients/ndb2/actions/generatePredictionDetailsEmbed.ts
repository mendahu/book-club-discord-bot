import { EmbedBuilder, time, TimestampStyles, userMention } from "discord.js";
import {
  NDB2API,
  PredictionLifeCycle,
} from "../../../utilities/ndb2Client/types";

const MS_IN_A_DAY = 1000 * 60 * 60 * 24;

const getRiskMessage = (endorsePayout: number, betCount: number) => {
  if (betCount < 4) {
    return `There aren't enough bets to get a good picture on this prediction's risk level yet. NDB2 makes a determination once there are at least four bets, but there are only ${betCount} at this moment.`;
  }
  if (endorsePayout > 1) {
    return "Endorsing this prediction is currently considered __risky__, while undorsing it is considered __safe__. Most people seem to think it will fail, so endorse at your own risk. Undorsement rewards will be lower.";
  } else {
    return "Endorsing this prediction is currently considered __safe__, while undorsing it is considered __risky__. Most people seem to think it will pass, so endorsement rewards will be lower. Undorse at your own risk.";
  }
};

const getOddsMessage = (endorsePayout: number, undorsePayout: number) => {
  return `A succesful prediction would pay current endorsers at ${endorsePayout} times their wager (days). Undorsers woud lose ${undorsePayout} times their wager.\n\nA failed prediction would pay out current undorsers at ${undorsePayout} their wager (days), and endorsers would lose ${endorsePayout} times their wager.`;
};

const getBaseWager = (predictionDate: Date, betDate: Date) => {
  return Math.floor(
    (predictionDate.getTime() - betDate.getTime()) / MS_IN_A_DAY
  );
};

export const generatePredictionDetailsEmbed = (
  prediction: NDB2API.EnhancedPrediction
) => {
  const endorsements = prediction.bets.filter((bet) => bet.endorsed);
  const undorsements = prediction.bets.filter((bet) => !bet.endorsed);

  const yesVotes = prediction.votes.filter((vote) => vote.vote);
  const noVotes = prediction.votes.filter((vote) => !vote.vote);

  const retired = new Date(prediction.retired_date);

  const embed = new EmbedBuilder({
    title: "Detailed Prediction View",
    description: prediction.text + `\n \u200B`,
    thumbnail: {
      url: "https://res.cloudinary.com/dj5enq03a/image/upload/v1679231457/Discord%20Assets/5067685_evmy8z.png",
    },
  });

  const fields = [];

  fields.push({
    name: "Current Prediction Status",
    value: prediction.status.toUpperCase() + `\n \u200B`,
  });

  if (prediction.status === PredictionLifeCycle.OPEN) {
    fields.push({
      name: "Risk Assessment",
      value: getRiskMessage(prediction.payouts.endorse, prediction.bets.length),
    });
    fields.push({
      name: "Current Odds",
      value:
        getOddsMessage(prediction.payouts.endorse, prediction.payouts.undorse) +
        `\n \u200B`,
    });
  }

  if (prediction.status === PredictionLifeCycle.RETIRED) {
    fields.push({
      name: "Status",
      value:
        `This prediction was retired by the predictor at ${time(
          retired,
          TimestampStyles.LongDateTime
        )} (${time(retired, TimestampStyles.RelativeTime)}).` + `\n \u200B`,
    });
  }

  const endorsementsText =
    endorsements
      .map((e) => {
        const betDate = new Date(e.date);
        return `${userMention(e.better.discord_id)} ${time(
          betDate,
          TimestampStyles.LongDate
        )} (${getBaseWager(
          new Date(prediction.due_date),
          betDate
        )} points wagered)`;
      })
      .join("\n") || "None";

  fields.push({
    name: `✅ Endorsements`,
    value: endorsementsText + `\n \u200B`,
  });

  const undorsementsText =
    undorsements
      .map((e) => {
        const betDate = new Date(e.date);
        return `${userMention(e.better.discord_id)} ${time(
          betDate,
          TimestampStyles.LongDate
        )} (${getBaseWager(
          new Date(prediction.due_date),
          betDate
        )} points wagered)`;
      })
      .join("\n") || "None";

  fields.push({
    name: `❌ Undorsements`,
    value: undorsementsText + `\n \u200B`,
  });

  if (prediction.status === PredictionLifeCycle.CLOSED) {
    const yesVotesText =
      yesVotes.map((e) => userMention(e.voter.discord_id)).join("\n") || "None";

    fields.push({
      name: `✅ Yes Votes`,
      value: yesVotesText + `\n \u200B`,
    });

    const noVotesText =
      noVotes.map((e) => userMention(e.voter.discord_id)).join("\n") || "None";

    fields.push({
      name: `❌ No Votes`,
      value: noVotesText + `\n \u200B`,
    });
  }

  fields.push({
    name: "Notes",
    value:
      "The data in this detail reply is current at the time of click but could become out of date as different bets or votes are made. These kinds of replies (ephemeral replies, that only you can see) cannot be edited after the fact, so to ensure you are getting the most up to date info, click the Details button again to get a new reply as needed.",
  });

  embed.setFields(fields);

  return embed;
};
