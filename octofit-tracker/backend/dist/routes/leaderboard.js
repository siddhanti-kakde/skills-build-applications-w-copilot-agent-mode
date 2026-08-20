"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Leaderboard_1 = __importDefault(require("../models/Leaderboard"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const rankings = await Leaderboard_1.default.find().populate('user').populate('team').sort({ score: -1, streak: -1 });
        res.json(rankings);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve leaderboard', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const entry = await Leaderboard_1.default.create(req.body);
        res.status(201).json(entry);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create leaderboard entry', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const entry = await Leaderboard_1.default.findById(req.params.id).populate('user').populate('team');
        if (!entry) {
            return res.status(404).json({ message: 'Leaderboard entry not found' });
        }
        return res.json(entry);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve leaderboard entry', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const entry = await Leaderboard_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!entry) {
            return res.status(404).json({ message: 'Leaderboard entry not found' });
        }
        return res.json(entry);
    }
    catch (error) {
        return res.status(400).json({ message: 'Failed to update leaderboard entry', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const entry = await Leaderboard_1.default.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Leaderboard entry not found' });
        }
        return res.json({ message: 'Leaderboard entry deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete leaderboard entry', error });
    }
});
exports.default = router;
