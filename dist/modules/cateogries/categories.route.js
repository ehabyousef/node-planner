"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const validator_1 = require("../../middleware/validator");
const verifyToken_1 = require("../../middleware/verifyToken");
const requireAuth_1 = require("../../middleware/requireAuth");
const categories_controller_1 = require("./categories.controller");
const categories_validation_1 = require("./categories.validation");
exports.categoriesRouter = express_1.default.Router();
// Apply authentication middleware
exports.categoriesRouter.use(verifyToken_1.verifyToken, requireAuth_1.requireAuth);
// GET routes
exports.categoriesRouter.get("/", categories_controller_1.getAllCategories);
exports.categoriesRouter.get("/:id", categories_controller_1.getSingleCategory);
// POST routes
exports.categoriesRouter.post("/addCategory", (0, validator_1.Validator)(categories_validation_1.createCategoryValidation), categories_controller_1.createCategory);
// PUT routes
exports.categoriesRouter.put("/updateCategory/:id", (0, validator_1.Validator)(categories_validation_1.updateCategoryValidation), categories_controller_1.updateCategory);
// DELETE routes
exports.categoriesRouter.delete("/deleteCategory/:id", categories_controller_1.deleteCategory);
