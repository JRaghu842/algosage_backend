const express = require("express");
let corsRouter = express.Router();
require("dotenv").config();

corsRouter.get("/proxy", async (req, res) => {
  const response = await fetch(req.query.url, {
    headers: {
      Authorization: `Bearer ${process.env.INCH_API}`,
    },
  });
  const data = await response.json();
  res.json(data);
});

module.exports = {
  corsRouter,
};
