const Ajv = require("ajv")
const schema = require("chrome-extension-manifest-json-schema").manifestV3Schema
const fs = require("fs")
const manifest = JSON.parse(fs.readFileSync("manifest.json"))
const ajv = new Ajv()
const valid = ajv.validate(schema, manifest)
if (!valid) {
  console.error("Manifest validation errors:", ajv.errors)
  process.exit(1)
}
console.log("manifest.json válido.")
