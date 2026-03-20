const express = require("express");
const app = express();
const sequelize = require("./config/database");
const routes = require("./routes");

app.use(express.json());
app.use(routes);

sequelize
  .authenticate()
  .then(() => console.log("Banco conectado"))
  .catch((err) => console.error(err));

app.listen(4000, () => console.log("Servidor rodando na porta 3000"));

module.exports = app;