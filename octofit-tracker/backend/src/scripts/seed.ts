import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Seed the octofit_db database with test data');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        username: 'ava_runner',
        email: 'ava@example.com',
        firstName: 'Ava',
        lastName: 'Stone',
        age: 27,
        fitnessGoal: 'Half-marathon prep',
      },
      {
        username: 'leo_strength',
        email: 'leo@example.com',
        firstName: 'Leo',
        lastName: 'Nguyen',
        age: 31,
        fitnessGoal: 'Strength building',
      },
      {
        username: 'mila_yoga',
        email: 'mila@example.com',
        firstName: 'Mila',
        lastName: 'Patel',
        age: 24,
        fitnessGoal: 'Mobility and recovery',
      },
    ]);

    const riverTeam = await Team.create({
      name: 'River Runners',
      description: 'A team focused on endurance, recovery, and steady progress.',
      captain: users[0]._id,
      members: users.map((user) => user._id),
    });

    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $set: { team: riverTeam._id } },
    );

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'Running',
        durationMinutes: 42,
        caloriesBurned: 420,
        distanceKm: 7.2,
        date: new Date(),
        notes: 'Tempo run with hill intervals',
      },
      {
        user: users[1]._id,
        type: 'Strength',
        durationMinutes: 50,
        caloriesBurned: 390,
        date: new Date(Date.now() - 86400000),
        notes: 'Upper body and core focus',
      },
      {
        user: users[2]._id,
        type: 'Yoga',
        durationMinutes: 35,
        caloriesBurned: 180,
        date: new Date(Date.now() - 172800000),
        notes: 'Mobility and breathwork',
      },
    ]);

    await Leaderboard.insertMany([
      {
        user: users[0]._id,
        team: riverTeam._id,
        score: 980,
        rank: 1,
        streak: 12,
      },
      {
        user: users[1]._id,
        team: riverTeam._id,
        score: 920,
        rank: 2,
        streak: 8,
      },
      {
        user: users[2]._id,
        team: riverTeam._id,
        score: 860,
        rank: 3,
        streak: 5,
      },
    ]);

    await Workout.insertMany([
      {
        name: 'Cardio Blast',
        category: 'Cardio',
        durationMinutes: 30,
        difficulty: 'Intermediate',
        focusArea: ['Heart health', 'Stamina'],
        instructions: ['Warm up for five minutes', 'Alternate brisk intervals and recovery', 'Cool down and stretch'],
      },
      {
        name: 'Core Stability Circuit',
        category: 'Strength',
        durationMinutes: 25,
        difficulty: 'Beginner',
        focusArea: ['Core', 'Balance'],
        instructions: ['Perform plank holds', 'Add dead bugs and glute bridges', 'Finish with mobility stretches'],
      },
      {
        name: 'Power Lift',
        category: 'Strength',
        durationMinutes: 40,
        difficulty: 'Advanced',
        focusArea: ['Legs', 'Back', 'Shoulders'],
        instructions: ['Warm up with dynamic squats', 'Lift with controlled tempo', 'Rest between sets'],
      },
    ]);

    console.log('Seed complete: 3 users, 1 team, 3 activities, 3 leaderboard entries, and 3 workouts created.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
