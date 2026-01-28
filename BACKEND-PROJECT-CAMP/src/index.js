import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000; // Maine 8000 kar diya taaki consistency rahe

connectDB()
  .then(() => {
    app.listen(port, () => {
      // ✅ Yahan ':' add kiya hai localhost ke baad
      console.log(`Backend app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("mongoDB connection error", err); // spelling fix: connection
    process.exit(1);
  });

// ✅ Vercel ke liye ye line sabse important hai
export default app;
