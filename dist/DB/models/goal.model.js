"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalModel = void 0;
const mongoose_1 = require("mongoose");
const goalSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    category_id: {
        type: mongoose_1.Types.ObjectId,
        ref: "Categories",
        required: true,
        index: true,
    },
    title: {
        type: String,
        minlength: 2,
        maxlength: 100,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        minlength: 2,
        maxlength: 500,
        required: true,
        trim: true,
    },
    image: {
        type: {
            id: { type: String, required: true },
            url: { type: String, required: true },
        },
        required: false,
        _id: false,
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW",
    },
    status: {
        type: String,
        enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
        default: "ACTIVE",
        index: true,
    },
    progress_percent: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    start_date: {
        type: Date,
        required: false,
    },
    end_date: {
        type: Date,
        required: false,
        validate: {
            validator: function (value) {
                return !this.start_date || !value || value >= this.start_date;
            },
            message: "End date must be after or equal to start date",
        },
    },
}, { timestamps: true });
// Virtual for tasks (doesn't store in DB)
goalSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "goal_id",
});
// Enable virtuals in JSON
goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });
exports.goalModel = (0, mongoose_1.model)("Goal", goalSchema);
