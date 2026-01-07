const app = require("./src/app.js"); //express app
const connectDB = require("./src/config/db.js");
const { PORT } = require("./src/config/env.js");


connectDB();

app.listen(PORT, () => {
    console.log(`Server runnning on port ${PORT}`);
});