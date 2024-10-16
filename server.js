process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1); // Exit with failure code
});

require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.name, err.message);
    process.exit(1);
  }
};
//connect to database
connectDB();

const port = process.env.PORT || 3000;
// 4) START SERVER
const server = app.listen(port, () => {
  console.log(`Server  running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);

  // Optional: Gracefully close the server before exiting
  server.close(() => {
    process.exit(1);
  });
});
