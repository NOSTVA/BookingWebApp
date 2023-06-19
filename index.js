const app = require("./src/config/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

connectDB(process.env.MONGODB_URI)
  .then(() => {
    console.log(`MongoDB running on ${process.env.MONGODB_URI}`);
    app.listen(process.env.PORT, () => console.log("app running...."));
  })
  .catch(console.log);

module.exports = app;
