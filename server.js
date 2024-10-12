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
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};
//connect to database
connectDB();

const port = process.env.PORT || 3000;
// 4) START SERVER
app.listen(port, () => {
  console.log(`Server  running on port ${port}...`);
});
