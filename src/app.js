const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");

const app = express();

// settings
app.set("port", process.env.PORT || 3030);

app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    partialsDir: __dirname + "/views/layouts",
  })
);

app.set("view engine", ".hbs");

// middlewares
app.use(session({
  secret: "HayMiMadreElBicho",
  resave: false,
  saveUninitialized: false
}));

// routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes/routes"));
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
