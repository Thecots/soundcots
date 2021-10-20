const express = require("express");
const session = require("express-session")
const admin = require('firebase-admin');
const router = express.Router();

// database firebase
const serviceAccount = require('../../node-firebase-ejemplo-39504-firebase-adminsdk-77fhz-7a95368c4d.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://node-firebase-ejemplo-39504-default-rtdb.europe-west1.firebasedatabase.app/',
});

const db = admin.database();

// user state
const user = {state: false, type: false};

// Middlewares


const sign = async (req,res, next) => {
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
router.get("/contacto", isLogged, async(req, res) => {
  const p = await db.collection('users');
  console.log(p);

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

router.post("/signin",sign, async(req, res) => {
  console.log(db);
  const {username, password} = req.body;
  
  await db.ref('users').once('value',(snapshot) => {
    const data = snapshot.val();   
    let x = 0;
    Object.keys(data).forEach(n => {
      if(username == data[n].username && password == data[n].password){
        req.session.userId = n;
        user.state = true;
        res.send('ok');
        return 0;
      }      
    });
  })
  res.send('UserError');
    
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

router.post("/signup",sign, async (req, res) => {
  const {username, password} = req.body;
  let x = 0;
  await db.ref('users').once('value',(snapshot) => {
    const data = snapshot.val();   
    Object.keys(data).forEach(n => {
      if(username == data[n].username){
        x = 1;
      }
      
    });
  })

  if(x === 1){
    db.ref('users').push({username, password});
    res.send('bien')
  }else{
    res.send('error')
  } 
});

module.exports = router;
