import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { seedProducts } from "./modules/products/infrastructure/products.seed.js";

const startServer = async () => {
  try {
    await connectDb();
    await seedProducts();

    app.listen(env.port, () => {
      console.log(`Backend is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
};

void startServer();
