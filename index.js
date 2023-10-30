const express = require("express");
const cors = require("cors");
require("dotenv").config();

let port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

const { vaultsdataRouter } = require("./routes/vaultsdata.routes");
const { corsRouter } = require("./routes/cors_prevent.routes");

app.get("/", (req, res) => {
  res.send("Backend connect check OK");
});

app.use("/", vaultsdataRouter);
app.use("/", corsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
