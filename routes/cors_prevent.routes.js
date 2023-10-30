const express = require("express");
let corsRouter = express.Router();
require("dotenv").config();

corsRouter.get("/proxy", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default; // Dynamic import of node-fetch

    const response = await fetch(req.query.url, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_API}`,
      },
    });

    if (!response.ok) {
      // Check if response status is not OK (not 2xx)
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Failed to fetch data." });
  }
});

module.exports = {
  corsRouter,
};
