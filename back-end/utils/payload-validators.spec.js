/**
 * Specs dos helpers de validação de payloads.
 *
 * Roda com Node nativo (sem dependências):
 *   node back-end/utils/payload-validators.spec.js
 *
 * Saída esperada: "OK: 16/16 testes" e exit code 0.
 * Falha em qualquer teste → exit code 1 (CI quebra).
 */

const assert = require("assert");
const {
  normalizarCEP,
  isCEPValido,
  isEnderecoPreenchido,
  isBancoPreenchido,
} = require("./payload-validators");

let pass = 0;
let total = 0;

function test(nome, fn) {
  total++;
  try {
    fn();
    pass++;
    console.log(`  ✓ ${nome}`);
  } catch (e) {
    console.error(`  ✗ ${nome}\n      ${e.message}`);
  }
}

console.log("normalizarCEP:");
test("dígitos puros são preservados", () =>
  assert.strictEqual(normalizarCEP("01000000"), "01000000"));
test("hífen é removido", () =>
  assert.strictEqual(normalizarCEP("01000-000"), "01000000"));
test("espaços e letras são removidos", () =>
  assert.strictEqual(normalizarCEP("CEP 01000-000"), "01000000"));
test("null vira string vazia", () =>
  assert.strictEqual(normalizarCEP(null), ""));
test("undefined vira string vazia", () =>
  assert.strictEqual(normalizarCEP(undefined), ""));

console.log("isCEPValido (TC-EB-06):");
test("8 dígitos é válido", () =>
  assert.strictEqual(isCEPValido("01000000"), true));
test("formato com hífen é válido após normalização", () =>
  assert.strictEqual(isCEPValido("01000-000"), true));
test("7 dígitos é inválido", () =>
  assert.strictEqual(isCEPValido("0100000"), false));
test("9 dígitos é inválido", () =>
  assert.strictEqual(isCEPValido("010000000"), false));
test("vazio é inválido", () =>
  assert.strictEqual(isCEPValido(""), false));

console.log("isEnderecoPreenchido (TC-EB-05):");
test("payload nulo retorna false", () =>
  assert.strictEqual(isEnderecoPreenchido(null), false));
test("payload vazio retorna false", () =>
  assert.strictEqual(isEnderecoPreenchido({}), false));
test("só Nacionalidade default retorna false", () =>
  assert.strictEqual(
    isEnderecoPreenchido({ Nacionalidade: "Brasileira" }),
    false
  ));
test("só Logradouro sem CEP retorna false", () =>
  assert.strictEqual(
    isEnderecoPreenchido({ Logradouro: "Rua das Flores" }),
    false
  ));
test("Logradouro + CEP retorna true", () =>
  assert.strictEqual(
    isEnderecoPreenchido({ Logradouro: "Rua das Flores", CEP: "01000000" }),
    true
  ));
test("CEP com hífen ainda assim conta como preenchido", () =>
  assert.strictEqual(
    isEnderecoPreenchido({ Logradouro: "Rua X", CEP: "01000-000" }),
    true
  ));

console.log("isBancoPreenchido (TC-EB-05):");
test("payload nulo retorna false", () =>
  assert.strictEqual(isBancoPreenchido(null), false));
test("só NomeBanco sem conta nem pix retorna false", () =>
  assert.strictEqual(
    isBancoPreenchido({ NomeBanco: "Banco do Brasil" }),
    false
  ));
test("NomeBanco + NumeroConta retorna true", () =>
  assert.strictEqual(
    isBancoPreenchido({ NomeBanco: "BB", NumeroConta: 67890 }),
    true
  ));
test("NomeBanco + CodigosPix retorna true", () =>
  assert.strictEqual(
    isBancoPreenchido({ NomeBanco: "BB", CodigosPix: "joao@x.com" }),
    true
  ));
test("só CodigosPix sem NomeBanco retorna false", () =>
  assert.strictEqual(
    isBancoPreenchido({ CodigosPix: "joao@x.com" }),
    false
  ));

console.log(`\n${pass === total ? "OK" : "FALHOU"}: ${pass}/${total} testes`);
process.exit(pass === total ? 0 : 1);
