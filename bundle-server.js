//run with node . will run forever
const express = require("express");
const app = express();
//express app requiring build.js
app.use(require("./build.js"));

app.listen(8081, () => console.log(`Ready to compile and serve bundle.js`));
