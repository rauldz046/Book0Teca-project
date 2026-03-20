const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bookoteca", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
