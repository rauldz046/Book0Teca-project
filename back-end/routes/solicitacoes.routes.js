const express = require("express");
const router = express.Router();
const SolicitacoesController = require("../controllers/Solicitacoes.controller");

router.get("/findAll",      SolicitacoesController.findAll);
router.get("/tipos",        SolicitacoesController.findTipos);
router.get("/etapas",       SolicitacoesController.findEtapas);
router.get("/:id",          SolicitacoesController.findById);
router.post("/criar",       SolicitacoesController.criar);
router.post("/avancar",     SolicitacoesController.avancarEtapa);
router.post("/cancelar",    SolicitacoesController.cancelar);

module.exports = router;
