const express = require("express");
const app = express.Router();

app.use(require("./index"));

module.exports = app;

/**
 * EL HANDLEBARS NOMÉS FUNCIONA SI UTILITZEM EL ROUTER(),
 * NO FUNCIONA DIRECTAMENT AMB EPXRESS()!
 */
