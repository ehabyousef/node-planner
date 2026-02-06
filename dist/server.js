"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const connections_1 = require("./DB/connections");
const logger_1 = __importDefault(require("./utils/logger"));
const index_1 = __importDefault(require("./index"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5002;
(0, connections_1.connectDB)()
    .then(() => {
    index_1.default.listen(PORT, () => {
        logger_1.default.info(`✅ Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    logger_1.default.error("❌ Failed to start server:", err.message);
    process.exit(1);
});
// Export for Vercel serverless
exports.default = index_1.default;
