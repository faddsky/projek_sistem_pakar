const pool = require('../config/db');

async function inspect() {
  try {
    const [tables] = await pool.query("SHOW TABLES");
    console.log("Tables:", tables);

    for (let tableObj of tables) {
      const tableName = Object.values(tableObj)[0];
      console.log(`\n--- Table: ${tableName} ---`);
      
      const [columns] = await pool.query(`DESCRIBE \`${tableName}\``);
      console.log("Columns:", columns.map(c => `${c.Field} (${c.Type})`));

      const [rows] = await pool.query(`SELECT * FROM \`${tableName}\` LIMIT 5`);
      console.log("Rows (up to 5):", rows);
    }
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    pool.end();
  }
}

inspect();
