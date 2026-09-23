import app from "./app";
import env from "./config/env";
import connectDB from "./config/database";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
