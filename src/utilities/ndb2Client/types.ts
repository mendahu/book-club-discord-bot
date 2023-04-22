export enum PredictionLifeCycle {
  OPEN = "open",
  RETIRED = "retired",
  CLOSED = "closed",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

const ErrorCode = {
  SERVER_ERROR: 0,
  AUTHENTICATION_ERROR: 1,
  BAD_REQUEST: 2,
  MALFORMED_BODY_DATA: 3,
};

export namespace NDB2API {
  export type GeneralResponse<T = null> = {
    success: boolean;
    errorCode?: keyof typeof ErrorCode;
    message: string | null;
    data: T;
  };

  export type EnhancedPredictionBet = {
    id: number;
    date: string;
    endorsed: boolean;
    wager: number;
    better: {
      id: string;
      discord_id: string;
    };
  };

  export type EnhancedPredictionVote = {
    id: string;
    vote: boolean;
    voted_date: string;
    voter: {
      id: string;
      discord_id: string;
    };
  };

  export type EnhancedPrediction = {
    id: number;
    predictor: {
      id: string;
      discord_id: string;
    };
    text: string;
    created_date: string;
    due_date: string;
    closed_date: string | null;
    triggered_date: string | null;
    triggerer: {
      id: string;
      discord_id: string;
    } | null;
    judged_date: string | null;
    retired_date: string | null;
    status: PredictionLifeCycle;
    bets: EnhancedPredictionBet[];
    votes: EnhancedPredictionVote[];
    payouts: {
      endorse: number;
      undorse: number;
    };
  };

  export type ShortEnhancedPrediction = Omit<
    EnhancedPrediction,
    "bets" | "votes"
  >;

  export type Scores = {
    score: {
      points: number;
      rank: number;
    };
    predictions: {
      successful: number;
      failed: number;
      pending: number;
      retired: number;
      rank: number;
    };
    bets: {
      successful: number;
      failed: number;
      pending: number;
      retired: number;
      rank: number;
    };
    votes: {
      sycophantic: number;
      contrarian: number;
      pending: number;
    };
  };

  export type Leader = {
    id: string;
    discord_id: string;
    rank: number;
    points?: number;
    predictions?: {
      successful: number;
      unsuccessful: number;
      total: number;
    };
    bets?: {
      successful: number;
      unsuccessful: number;
      total: number;
    };
  };

  export type AddPrediction = GeneralResponse<EnhancedPrediction>;

  export type AddBet = GeneralResponse<EnhancedPrediction>;

  export type GetPrediction = GeneralResponse<EnhancedPrediction>;

  export type TriggerPrediction = GeneralResponse<EnhancedPrediction>;

  export type GetScores = GeneralResponse<Scores>;

  export type SearchPredictions = GeneralResponse<ShortEnhancedPrediction[]>;

  export type GetLeaderboard = GeneralResponse<{
    type: "points" | "predictions" | "bets";
    season?: {
      id: number;
      name: string;
      start: string;
      end: string;
    };
    leaders: Leader[];
  }>;
}

// export interface Record {
//   id: number;
// }

// export interface User extends Record {
//   discord_id: string;
// }

// export interface Bet extends Record {
//   better_id: number;
//   prediction_id: number;
//   endorsed: boolean;
//   created: Date;
// }

// export interface Prediction extends Record {
//   predictor_id: number;
//   text: string;
//   created: Date;
//   due: Date;
//   closed: Date;
//   judged: Date;
//   closer_id: number;
//   succesful: boolean;
//   message_id: string;
//   channel_id: string;
// }

// export interface Vote extends Record {
//   voter_id: number;
//   prediction_id: number;
//   affirmative: boolean;
// }

// export interface Season extends Record {
//   name: string;
//   start: Date;
//   end: Date;
// }

// // View Records

// export interface EnhancedPrediction
//   extends Omit<Prediction, "predictor_id" | "closer_id" | "successful"> {
//   predictor_id: number;
//   predictor_discord_id: string;
//   closer_id: number;
//   successful: boolean;
//   votes: Omit<Vote, "prediction_id">[];
//   bets: Omit<Bet, "prediction_id">[];
//   odds: number;
// }

// export interface EnhancedSeason extends Season {
//   status: SeasonStatus;
// }

// // API Records

// export interface APISeason extends Record {
//   name: string;
//   start: string;
//   end: string;
// }

// export interface APIEnhancedSeason extends APISeason {
//   status: SeasonStatus;
// }

// export enum SeasonStatus {
//   FUTURE = "future",
//   NEXT = "next",
//   CURRENT = "current",
//   LAST = "last",
//   PAST = "past",
// }

// export type APIUser = User;

// export interface APIScore {
//   user_id: number;
//   user_discord_id: string;
//   season_id: number;
//   season: Omit<APIEnhancedSeason, "id">;
//   points: number;
//   predictions: {
//     successful: number;
//     unsuccessful: number;
//     pending: number;
//   };
//   endorsements: {
//     successful: number;
//     unsuccessful: number;
//     pending: number;
//   };
//   undorsements: {
//     successful: number;
//     unsuccessful: number;
//     pending: number;
//   };
// }

// export interface APIEnhancedUser extends APIUser {
//   predictions: Omit<APIPrediction, "predictor_id">[];
//   bets: Omit<APIBet, "better_id">[];
//   scores: Omit<APIScore, "user_id" | "user_discord_id">[];
// }

// export interface APIBet extends Omit<Bet, "created"> {
//   created: string;
// }

// export interface APIPrediction
//   extends Omit<Prediction, "created" | "closed" | "due" | "judged"> {
//   created: string;
//   closed: string;
//   due: string;
//   judged: string;
// }

// export type APIVote = Vote;

// // API View Records

// export interface APIEnhancedPrediction
//   extends Omit<APIPrediction, "predictor_id" | "closer_id" | "successful"> {
//   predictor_id: number;
//   predictor_discord_id: string;
//   closer_id: number;
//   successful: boolean;
//   votes: Omit<APIVote, "prediction_id">[];
//   bets: Omit<APIBet, "prediction_id">[];
//   odds: number;
// }

// // API REsponse Records

// export interface ClosePredictionResponse extends Record {
//   channel_id: string;
// }
