"use strict";

const Sequelize = require("sequelize");
const config = require("../db.config.js")[process.env.NODE_ENV];

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: "postgres",
    host: config.host,
    port: config.port || 5432,
    logging: () => {
      if (!process.env.SILENT_OPS) console.log;
    },
  }
);

sequelize
  .authenticate()
  .then(() =>
    console.log(`
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
          Database connection has been established successfully
                   process.env.NODE_ENV: ${process.env.NODE_ENV}
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  `)
  )
  .catch((err) => console.log("Unable to connect to the database: " + err));

module.exports = sequelize;
