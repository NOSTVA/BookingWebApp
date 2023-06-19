const app = require("./src/config/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

const mongo_uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://vercel-admin-user:E9596XTjPTrwIXLN@cluster0.rjrxhmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;

connectDB(mongo_uri)
  .then(() => {
    console.log(`MongoDB running on ${mongo_uri}`);
    app.listen(port, () => console.log("app running...."));
  })
  .catch(console.log);

module.exports = app;
