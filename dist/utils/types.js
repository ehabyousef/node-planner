"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.imageSchema = new mongoose_1.Schema({
    id: { type: String, required: true }, // Cloudinary public_id
    url: { type: String, required: true }, // Cloudinary URL
}, { _id: false, id: false });
