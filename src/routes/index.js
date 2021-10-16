const express = require("express");
const router = express.Router();

const user = {state: false, type: false};

let db = [
  {
    id: 1,
    user: 'hacker',
    password: 'hacker'
  }
]

// Middlewares
const sign = (req,res, next) => {
  if(req.session.userId){
      res.redirect('/');
  }else{
      next();
  }
}


const isLogged = (req, res, next) => {
  if(req.session.userId){
    user.state = true;
  }else{
    user.state = false;
  }
next();
}

/* Home */
router.get("/", isLogged, (req, res) => {
  res.render("index", {
    homeCSS: true,
    user,
  });
});

/* Servicios */
router.get("/servicios", isLogged, (req, res) => {
  res.render("servicios", {
    serviciosCSS: true,
    user,
  });
});

/* Catalogo */
router.get("/catalogo", isLogged, (req, res) => {
  res.render("catalogo", {
    catalogo: true,
    catalogoCSS: true,
    user,
  });
});

/* Contacto */
router.get("/contacto", isLogged, (req, res) => {
  res.render("contacto", {
    contactoCSS: true,
  });
});

/* SignIn */
router.get("/signin",sign, (req, res) => {
  res.render("signin", {
    signCSS: true,
    signJS: true,
    ajaxModule: true,
    user,
  });
});

router.post("/signin",sign, (req, res) => {
  console.log(db);
  const {username, password} = req.body;
  let x = db.findIndex(e => e.user === username);
  if(x >= 0){
    if(db[x].password == password){
      // login
      req.session.userId = db[x].id;
      user.state = true;
      res.send('ok')
    }else{
      res.send('passwordError')
    }
  }else{
    res.send('UserError')
  }
  
});

/* SignUp */
router.get("/signup",sign, (req, res) => {
  res.render("signup", {
    signCSS: true,
    signJS: true,
    ajaxModule: true,
    user,
  });
});

router.post("/signup",sign, (req, res) => {
  const {username, password} = req.body;
  const user = db.find(e => e.user === username);
  console.log(user);
  if(!user){
    db.push({
      id: (db[(db.length-1)].id)+1,
      username,
      password,
    })
    res.send('bien')
  }else{
    res.send('error')
  } 
});

module.exports = router;
