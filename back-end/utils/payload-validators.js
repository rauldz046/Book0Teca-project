/**
 * Helpers de validação de payloads de Endereço e Banco.
 * Compartilhados entre Usuarios.controller e Funcionarios.controller para
 * garantir comportamento consistente (TC-EB-05 e TC-EB-06).
 *
 * Critério "preenchido" — mais estrito que o mock antigo:
 *   Endereço: exige Logradouro E CEP. Outros campos isolados não bastam.
 *   Banco:    exige NomeBanco E (NumeroConta OU CodigosPix).
 *
 * Justificativa: o mock aceitava qualquer campo isolado (até Nacionalidade,
 * que tem default "Brasileira"), o que ainda gerava linhas-lixo.
 */

/** Normaliza um CEP qualquer para apenas dígitos. Aceita "01000-000" e "01000000". */
function normalizarCEP(cep) {
  if (cep == null) return "";
  return String(cep).replace(/\D/g, "");
}

/** TC-EB-06: CEP válido = exatamente 8 dígitos após normalização. */
function isCEPValido(cep) {
  return normalizarCEP(cep).length === 8;
}

/**
 * TC-EB-05: Endereço considerado "preenchido" para fins de criação.
 * Exige Logradouro E CEP — campos mínimos para um endereço útil.
 * Retorna false para payloads vazios, nulos ou só com Nacionalidade default.
 */
function isEnderecoPreenchido(p) {
  if (!p || typeof p !== "object") return false;
  const logradouro = (p.Logradouro || "").trim();
  const cep = normalizarCEP(p.CEP);
  return logradouro.length > 0 && cep.length > 0;
}

/**
 * TC-EB-05: Banco considerado "preenchido" para fins de criação.
 * Exige NomeBanco E pelo menos um dos campos transacionais (Conta ou Pix).
 */
function isBancoPreenchido(p) {
  if (!p || typeof p !== "object") return false;
  const nome = (p.NomeBanco || "").trim();
  const conta = p.NumeroConta != null && String(p.NumeroConta).trim() !== "";
  const pix = (p.CodigosPix || "").trim();
  return nome.length > 0 && (conta || pix.length > 0);
}

module.exports = {
  normalizarCEP,
  isCEPValido,
  isEnderecoPreenchido,
  isBancoPreenchido,
};
