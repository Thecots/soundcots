const express = require("express");
const router = express.Router();

/* Home */
router.get("/", (req, res) => {
  res.render("index", {
    homeCSS: true
  });
});

/* Servicios */
router.get("/servicios", (req, res) => {
  res.render("servicios", {
    serviciosCSS: true,
  });
});

/* Catalogo */
router.get("/catalogo", (req, res) => {
  res.render("catalogo", {
    catalogo: true,
    catalogoCSS: true,
  });
});

/* Contacto */
router.get("/contacto", (req, res) => {
  res.render("contacto", {
    contactoCSS: true,
  });
});

module.exports = router;
