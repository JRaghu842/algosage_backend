let express = require("express");
let vaultsdataRouter = express.Router();
const { Pool } = require("pg");
let { Redis } = require("ioredis");
require("dotenv").config();

// Database connection
const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_name,
  password: process.env.db_password,
  port: process.env.db_port,
  ssl: {
    rejectUnauthorized: false,
  },
});

const client = new Redis({
  port: process.env.redis_port,
  host: process.env.redis_host,
  password: process.env.redis_password,
});

client.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

client.on("error", (err) => {
  console.error("Error connecting to Redis Cloud:", err);
});

// client
//   .flushdb()
//   .then(() => {
//     console.log("Redis database flushed/cleared");
//   })
//   .catch((err) => {
//     console.error("Error flushing Redis database:", err);
//   });

vaultsdataRouter.get("/api/data", async (req, res) => {
  try {
    // Check Redis cache first
    const cachedData = await client.get("vaultsData");

    if (cachedData) {
      // If data is in cache, return it

      res.json(JSON.parse(cachedData));
    } else {
      // Query to fetch data with JOIN operation
      const query = `
          SELECT
              v.vault_address,
              v.pool_address,
              v.fee_tier,
              v.total_assets_token0,
              v.total_assets_token1,
              v.algo_shares,
              v.token0_address,
              v.token1_address,
              t0.name as token0_name,
              t0.symbol as token0_symbol,
              t0.decimal as token0_decimal,
              t1.name as token1_name,
              t1.symbol as token1_symbol,
              t1.decimal as token1_decimal
          FROM vaults v
          JOIN tokens t0 ON v.token0_address = t0.token_address
          JOIN tokens t1 ON v.token1_address = t1.token_address;
        `;

      const result = await pool.query(query);
      const dbData = result.rows;

      // Save the database result into cache for 1 hour (3600 seconds)
      await client.set("vaultsData", JSON.stringify(dbData), "EX", 3600);

      res.json(dbData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database or Cache error" });
  }
});

module.exports = {
  vaultsdataRouter,
};
