"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Activity_1 = __importDefault(require("../models/Activity"));
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const activities = await Activity_1.default.find().populate('user').sort({ date: -1 });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to retrieve activities', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const activity = await Activity_1.default.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(400).json({ message: 'Failed to create activity', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findById(req.params.id).populate('user');
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        return res.json(activity);
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to retrieve activity', error });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        return res.json(activity);
    }
    catch (error) {
        return res.status(400).json({ message: 'Failed to update activity', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const activity = await Activity_1.default.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        return res.json({ message: 'Activity deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to delete activity', error });
    }
});
exports.default = router;
