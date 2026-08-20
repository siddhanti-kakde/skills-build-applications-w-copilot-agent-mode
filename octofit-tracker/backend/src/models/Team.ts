import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  captain?: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    captain: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
  },
  { timestamps: true },
);

const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);

export default Team;
