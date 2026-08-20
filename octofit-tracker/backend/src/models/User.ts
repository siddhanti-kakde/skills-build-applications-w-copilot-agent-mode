import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  fitnessGoal: string;
  team?: mongoose.Types.ObjectId | null;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 12,
      max: 100,
    },
    fitnessGoal: {
      type: String,
      default: 'General fitness',
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
