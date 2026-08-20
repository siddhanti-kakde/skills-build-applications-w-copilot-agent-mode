"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Team_1 = __importDefault(require("../models/Team"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const teams = await Team_1.default.find().populate('members').populate('captain').sort({ createdAt: -1 });
        res.json(teams);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve teams', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const team = await Team_1.default.create(req.body);
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create team', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const team = await Team_1.default.findById(req.params.id).populate('members').populate('captain');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        return res.json(team);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve team', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const team = await Team_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        return res.json(team);
    }
    catch (error) {
        return res.status(400).json({ message: 'Failed to update team', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const team = await Team_1.default.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        return res.json({ message: 'Team deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete team', error });
    }
});
exports.default = router;
