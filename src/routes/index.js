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

const userAuth = async(req,res,next) => {
  if(!req.session.userId){
    res.redirect('/');
}else{
    next();
}
}

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
      if(data[n].state == 1){
        products.push({
          album: data[n].album,
          artista: data[n].artista,
          foto: data[n].foto,
          precio: data[n].precio,
          id: n
        });
      }
    })
    products = products.sort(() => { return Math.random() - 0.5});
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
router.get("/catalogo", isLogged, async(req, res) => {
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
    });
    res.render("catalogo", {
      catalogo: true,
      catalogoCSS: true,
      products: products.reverse(),
      user,
    });
  });    

});

/* Contacto */
router.get("/contacto", isLogged, async(req, res) => {
  db.ref('users/-MmtEqI314jIVu0wxJR6/username').set("cerresiete");
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
      db.ref('users').push({username, password, tpye: false, cesta: []});
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


/* PRODUCTOS */
router.get("/product/:id",isLogged, async(req, res) => {
  const {id} = req.params;
  await db.ref('products').once('value',(snapshot) => {
    const data = snapshot.val(),rec = [], lol = [];
    for (let i = 0; i < 7; i++) {
        let x = Math.round(Math.random()*Object.keys(data).length);
        if(lol.find(e => e == x) == undefined && Object.keys(data)[x] != id && Object.keys(data)[x] != undefined) {
            lol.push(x);
            album = data[Object.keys(data)[x]].album.length < 10 ? data[Object.keys(data)[x]].album :data[Object.keys(data)[x]].album.substring(0,19)+" ...";
            rec.push({
              album,
              artista:data[Object.keys(data)[x]].artista,
              foto:data[Object.keys(data)[x]].foto,
              precio:data[Object.keys(data)[x]].precio,
              id:Object.keys(data)[x]
            });
        }else{
          i--;
        }
    }
    Object.keys(data).forEach(n => {
      if(n == id){
        let products = data[n];
        res.render("product", {
          products,
          rec,
          productosCSS: true,
          user,
          id: n
        });
        return;
      }
   })
   
  });    

});

/* Cesta */
router.get("/cesta",userAuth,  async(req, res) => {
  await db.ref('users').once('value',(snapshot) => {
    const data = snapshot.val();
    let cesta = [];
    if(data[req.session.userId].cesta === undefined){
      cesta = false;
      res.render("cesta", {
        user,
        cestaCSS: true,
        cesta
      });
    }else{
      let x = data[req.session.userId].cesta;
        db.ref('products').once('value',(snapshot2) => {
        const data2 = snapshot2.val();

          for (let i = 0; i < x.length; i++) {
            cesta.push({
              album: data2[x[i]].album,
              artista: data2[x[i]].artista,
              precio: data2[x[i]].precio,
              foto: data2[x[i]].foto,
              id:x[i]
            });
          }

          res.render("cesta", {
            user,
            cestaCSS: true,
            cesta
          });
      });

    }
    
  });
})

/* Añadir producto a la cesta */

router.post("/addToBasket",isLogged, async(req, res) => {
  const {id} = req.body;
  if(!req.session.userId){
    res.send('error');
  }else{
    await db.ref('users').once('value',(snapshot) => {
      const data = snapshot.val();
      if(data[req.session.userId].cesta === undefined){
        db.ref('users/'+req.session.userId+'/cesta').set([id]);
      }else{
        let x = data[req.session.userId].cesta
        x.push(id);
        db.ref('users/'+req.session.userId+'/cesta').set(x);
      }
      res.send('ok');
    });
  }

});

/* Borrar items de la cesta */
router.post("/deleteCesta",isLogged, async(req, res) => {
  const {id} = req.body;
 
    await db.ref('users').once('value',(snapshot) => {
      const data = snapshot.val();
      let g = data[req.session.userId].cesta.indexOf(id);
      data[req.session.userId].cesta.splice(g,1)
      db.ref('users/'+req.session.userId+'/cesta').set(data[req.session.userId].cesta);
      
      res.send('ok');
    });

});


/* Dashboard */
/* adminCheck,  <--------------------------------------- poner*/ 
router.get("/dashboard", async(req, res) => {
  /* if(user.state == false){res.render('/')} */
  await db.ref('products').once('value',(snapshot) => {
    const data = snapshot.val(),rec = [];

    Object.keys(data).forEach(n => {
      rec.push({
        album:data[n].album,
        artista:data[n].artista,
        foto:data[n].foto,
        precio:data[n].precio,
        id:n
      });
    })

    res.render("dashboard", {
      user,
      rec: rec.reverse(),
      dashboardCSS: true,
      dashboardHeader: true,
    });
  });

});
router.get("/dashboard/users", (req, res) => {
  /* if(user.state == false){res.render('/')} */


  res.render("dashboardUsers", {
    user,
    dashboardCSS: true,
    dashboardHeader: true,
  });
});

/* Cesta */
module.exports = router;
