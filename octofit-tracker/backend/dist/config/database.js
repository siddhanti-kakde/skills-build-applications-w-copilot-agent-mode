"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
    }
    catch (error) {
        console.error('Error connecting to octofit_db:', error);
        process.exit(1);
    }
}
mongoose_1.default.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
