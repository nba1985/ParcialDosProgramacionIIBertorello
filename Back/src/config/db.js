const sql = require("mssql");
require("dotenv").config({ path: __dirname + "/../../.env" });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true"
  }
};

async function getConnection() {
  return await sql.connect(dbConfig);
}

module.exports = { sql, getConnection };