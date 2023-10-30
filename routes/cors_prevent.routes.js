const express = require("express");
let corsRouter = express.Router();
require("dotenv").config();

corsRouter.get("/proxy", async (req, res) => {
  try {
    if (!req.query.url) {
      return res
        .status(400)
        .send({ error: "URL query parameter is required." });
    }

    const fetch = (await import("node-fetch")).default;

    const response = await fetch(req.query.url, {
      headers: {
        Authorization: `Bearer ${process.env.INCH_API}`,
      },
    });

    if (!response.ok) {
      // Log the detailed response for debugging
      console.error("Failed API Response:", await response.text());
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ error: "Failed to fetch data.", fullerrror: error.message });
  }
});

module.exports = {
  corsRouter,
};
