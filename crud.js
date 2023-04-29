const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

class DynamicCrudEndpoint {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    this.app = express();
    this.app.use(express.json());
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`Servidor iniciado na porta ${port}`);
    });
  }

  createEndpoint() {
    this.app.post("/api/crud", (req, res) => {
      const { tableName, fields } = req.body;
      const id = fields.id;

      const query = `INSERT INTO ${tableName} SET ?`;

      this.connection.query(query, fields, (error, results) => { 
        if (error) {
          console.error(error);
          return res.status(500).json({ error: error.sqlMessage });
        }

        return res.status(201).json({ message: "Record created successfully" });
      });
    });
  }

  readEndpoint() {
    this.app.get("/api/crud", (req, res) => {
      const { tableName, fields } = req.body;
  
      let query = `SELECT * FROM ${tableName}`;
  
      if (fields && Object.keys(fields).length > 0) {
        query += " WHERE";
        // Build the WHERE clause dynamically based on the fields provided
        Object.keys(fields).forEach((key) => {
          query += ` ${key} = ${mysql.escape(fields[key])} AND`;
        });
        // Remove the trailing 'AND' from the query
        query = query.slice(0, -4);
      }
  
      this.connection.query(query, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error fetching records" });
        }
  
        return res.status(200).json(results);
      });
    });
  }
  

  updateEndpoint() {
    this.app.put("/api/crud", (req, res) => {
      const { tableName, fields } = req.body;
      const key = Object.keys(fields)[0]; // Assuming there is only one key in the fields object
      const value = fields[key];
  
      const query = `UPDATE ${tableName} SET ? WHERE ${key} = ?`;
  
      this.connection.query(query, [fields, value], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error updating record" });
        }
  
        return res.status(200).json({ message: "Record updated successfully" });
      });
    });
  }
  
  deleteEndpoint() {
    this.app.delete("/api/crud", (req, res) => {
      const { tableName, fields } = req.body;
      const key = Object.keys(fields)[0];
      const value = fields[key];
  
      const query = `DELETE FROM ${tableName} WHERE ${key} = ?`;
  
      this.connection.query(query, [value], (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error deleting record" });
        }
  
        return res.status(200).json({ message: "Record deleted successfully" });
      });
    });
  }
  

  setupEndpoints() {
    this.createEndpoint();
    this.readEndpoint();
    this.updateEndpoint();
    this.deleteEndpoint();
  }
}

module.exports = DynamicCrudEndpoint;
