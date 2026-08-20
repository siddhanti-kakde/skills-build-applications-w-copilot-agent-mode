import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  category: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focusArea: string[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 10,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    focusArea: [{
      type: String,
      trim: true,
    }],
    instructions: [{
      type: String,
      trim: true,
    }],
  },
  { timestamps: true },
);

const Workout = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;
