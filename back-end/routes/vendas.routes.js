const express = require("express");
const router = express.Router();
const VendasController = require("../controllers/Vendas.controller");

router.get("/findAll",            VendasController.findAll);
router.get("/relatorio",          VendasController.relatorioVendas);   // ?dataInicio=&dataFim= (RF30)
router.get("/:id",                VendasController.findById);
router.post("/registrar",         VendasController.registrarVenda);    // RF08, RF09
router.post("/confirmarPagamento",VendasController.confirmarPagamento);// RF27
router.post("/cancelar",          VendasController.cancelarVenda);     // RF39

module.exports = router;
