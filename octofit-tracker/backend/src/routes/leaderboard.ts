import { Router } from 'express';
import Leaderboard from '../models/Leaderboard';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const rankings = await Leaderboard.find().populate('user').populate('team').sort({ score: -1, streak: -1 });
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve leaderboard', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const entry = await Leaderboard.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create leaderboard entry', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const entry = await Leaderboard.findById(req.params.id).populate('user').populate('team');
    if (!entry) {
      return res.status(404).json({ message: 'Leaderboard entry not found' });
    }
    return res.json(entry);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve leaderboard entry', error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const entry = await Leaderboard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) {
      return res.status(404).json({ message: 'Leaderboard entry not found' });
    }
    return res.json(entry);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update leaderboard entry', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entry = await Leaderboard.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Leaderboard entry not found' });
    }
    return res.json({ message: 'Leaderboard entry deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete leaderboard entry', error });
  }
});

export default router;
