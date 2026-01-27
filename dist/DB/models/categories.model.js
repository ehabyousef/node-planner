"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = void 0;
const mongoose_1 = require("mongoose");
const categoriesSchema = new mongoose_1.Schema({
    Name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    color: {
        type: String,
        required: true,
    },
}, { timestamps: true });
// Virtual for goals (query from Goal model via category_id)
categoriesSchema.virtual("goals", {
    ref: "Goal",
    localField: "_id",
    foreignField: "category_id",
});
// Enable virtuals in JSON
categoriesSchema.set("toJSON", { virtuals: true });
categoriesSchema.set("toObject", { virtuals: true });
exports.categories = (0, mongoose_1.model)("Categories", categoriesSchema);
