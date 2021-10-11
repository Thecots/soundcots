const express = require("express");
const router = express.Router();

/* Home */
router.get("/", (req, res) => {
  res.render("index", {
    txt: "lorem ipsum sit amet HOME",
    title: "Home",
    active: { Home: true },
  });
});

/* Servicios */
router.get("/servicios", (req, res) => {
  res.render("servicios", {
    txt: "lorem ipsum sit amet CONTACTE",
    title: "Contacte",
    active: { Contacte: true },
  });
});

/* Catalogo */
router.get("/catalogo", (req, res) => {
  res.render("catalogo", {
    catalogo: true,
    title: "Contacte",
    active: { Contacte: true },
  });
});

/* Contacto */
router.get("/contacto", (req, res) => {
  res.render("contacto", {
    txt: "lorem ipsum sit amet CONTACTE",
    title: "Contacte",
    active: { Contacte: true },
  });
});

module.exports = router;
