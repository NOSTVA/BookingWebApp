const app = require("./src/config/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

connectDB(process.env.MONGO_URI)
  .then(() => {
    console.log(`MongoDB running on ${process.env.MONGO_URI}`);
  })
  .catch(console.log);

module.exports = (req, res) => {
  app(req, res);
};
