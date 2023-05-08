import { APIEmbedField, EmbedBuilder } from "discord.js";
import {
  NDB2API,
  PredictionLifeCycle,
} from "../../../../utilities/ndb2Client/types";
import embedFields from "./fields";

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

  const fields: APIEmbedField[] = [embedFields.longStatus(prediction.status)];

  if (prediction.status === PredictionLifeCycle.OPEN) {
    fields.push(
      embedFields.riskAssessment(
        prediction.bets.length,
        prediction.payouts.endorse
      )
    );
    fields.push(embedFields.longOdds(prediction.payouts));
    fields.push(embedFields.longBets(endorsements, "endorsements"));
    fields.push(embedFields.longBets(undorsements, "undorsements"));
    fields.push(embedFields.accuracyDisclaimer());
  }

  if (prediction.status === PredictionLifeCycle.CLOSED) {
    fields.push(embedFields.longBets(endorsements, "endorsements"));
    fields.push(embedFields.longBets(undorsements, "undorsements"));
    fields.push(embedFields.longVotes(yesVotes, "yes"));
    fields.push(embedFields.longVotes(noVotes, "no"));
    fields.push(embedFields.accuracyDisclaimer());
  }

  if (prediction.status === PredictionLifeCycle.RETIRED) {
    fields.push(embedFields.longBets(endorsements, "endorsements"));
    fields.push(embedFields.longBets(undorsements, "undorsements"));
  }

  if (prediction.status === PredictionLifeCycle.SUCCESSFUL) {
    fields.push(embedFields.payoutsText(prediction.status, prediction.payouts));
    fields.push(
      embedFields.longPayouts(
        prediction.status,
        prediction.payouts,
        endorsements,
        undorsements
      )
    );
    fields.push(embedFields.longVotes(yesVotes, "yes"));
    fields.push(embedFields.longVotes(noVotes, "no"));
  }

  if (prediction.status === PredictionLifeCycle.FAILED) {
    fields.push(embedFields.payoutsText(prediction.status, prediction.payouts));
    fields.push(
      embedFields.longPayouts(
        prediction.status,
        prediction.payouts,
        endorsements,
        undorsements
      )
    );
    fields.push(embedFields.longVotes(yesVotes, "yes"));
    fields.push(embedFields.longVotes(noVotes, "no"));
  }

  embed.setFields(fields);

  return embed;
};
