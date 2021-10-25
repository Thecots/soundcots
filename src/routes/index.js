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

const adminCheck = async (req, res, next) => {
  if(user.type === true){
    next();
  }else{
    res.redirect('/');
  }
}

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
  console.log(user);
next();
}

/*   db.ref('products').push(
    {
      album: "INTER SHIBUYA - LA MAFIA",
      artista: "Feid",
      foto: "intershibuya.jpeg",
      precio: 10,
      state: 1
    }); */

/* Home */
router.get("/", isLogged, async(req, res) => { 

  await db.ref('products').once('value',(snapshot) => {
    const data = snapshot.val();   
    let products = [];
    Object.keys(data).forEach(n => {
      products.push({
        album: data[n].album,
        artista: data[n].artista,
        foto: data[n].foto,
        precio: data[n].precio,
        id: n
      });
   })
   res.render("index", {
    products,
    homeCSS: true,
    user,
  });
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
  db.ref('products').once('value', (snapshot) => {
    
  })
  res.render("catalogo", {
    catalogo: true,
    catalogoCSS: true,
    user,
  });
});

/* Contacto */
router.get("/contacto", isLogged, async(req, res) => {
  res.render("contacto", {
    contactoCSS: true,
    user,
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
  const {username, password} = req.body;
  
  await db.ref('users').once('value',(snapshot) => {
    const data = snapshot.val();   
    let x = 0;
    Object.keys(data).forEach(n => {
      if(username == data[n].username){
        if(password == data[n].password){
          req.session.userId = n;
          user.state = true;
          user.type = data[n].tpye;
          res.send('ok');
          x = 1;
        }else{
          res.send('passwordError');
          x = 1;
        }
      }      
    });
    if(x != 1){res.send('UserError');}
  })
  
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

    if(x != 1){
      db.ref('users').push({username, password, tpye: false});
      res.send('bien')
    }else{
      res.send('error')
    } 
  })

});

/* Cerrar sessión */

router.post("/signout", isLogged, (req, res) => {
  req.session.userId = null;
  user.type = false;
  res.send('ok');
})

router.get("/product/:id", async(req, res) => {
  const {id} = req.params;
  await db.ref('products').once('value',(snapshot) => {
    const data = snapshot.val();   
    let products = [];
    Object.keys(data).forEach(n => {
      if(n == id){
        products.push(data[n]);
        res.render("product", {
          products,
          user,
        });
        return;
      }
   })
   
  });    

});


/* Dashboard */

router.get("/dashboard",adminCheck, (req, res) => {
  res.render("dashboard", {
    user,
  });
});

module.exports = router;
