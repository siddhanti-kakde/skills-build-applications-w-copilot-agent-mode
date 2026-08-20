import mongoose, { Schema, type Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  user: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  score: number;
  rank: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

const Leaderboard = mongoose.models.Leaderboard || mongoose.model<ILeaderboardEntry>('Leaderboard', leaderboardSchema);

export default Leaderboard;
