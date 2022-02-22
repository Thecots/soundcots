const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const multer = require('multer');
const app = express();

// settings
app.set("port", process.env.PORT || 8080);
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

const storage = multer.diskStorage({
  destination: path.join(__dirname,'public/img/album'),
  filename: (req,file,cb) => {
      cb(null,new Date().getTime()+path.extname(file.originalname));
  }
})
app.use(multer({storage}).single('foto'));

// routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("./routes/routes"));
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
