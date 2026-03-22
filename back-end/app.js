const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/database");
const routes = require("./routes");
const port = 4000;

app.use(express.json());
app.use(
  cors({
    origin: true, // libera qualquer localhost
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(routes);

sequelize.authenticate().catch((err) => console.error(err));

app.listen(port, () => console.log("Servidor rodando na porta " + port));

module.exports = app;
