import app from "./app";
import env from "./config/env";
import connectDB from "./config/database";

import seedAdmin from "./utils/admin.seed";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    await seedAdmin();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
