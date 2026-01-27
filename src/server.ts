import dotenv from "dotenv";
import { connectDB } from "./DB/connections";
import logger from "./utils/logger";
import app from "./index";

dotenv.config();

const PORT = process.env.PORT || 5002;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });

// Export for Vercel serverless
export default app;
