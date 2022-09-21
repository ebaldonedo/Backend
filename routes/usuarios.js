//rutas para crear usuarios
const express = require("express")
const router = express.Router();
const usuarioController = require("../controllers/usuarioController")
const {check} = require("express-validator")


//Crea un usuario
//api/usuarios

router.post("/", 
[
check("nombre","El nombre es Obligatorio").not().isEmpty(),
check("email","agrega un email valido").isEmail(),
check("password", "El password debeser minimo de 6 caracteres y maximo 12").isLength({min:6})

],


usuarioController.crearUsuario);

module.exports=router;