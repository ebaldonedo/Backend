const express= require("express");
const { crearProyecto, obtenerProyectos, actualizaProyecto, eliminarProyecto } = require("../controllers/proyectoController");
const router = express.Router();
const auth =require("../middlewares/auth")
const {check} =require("express-validator")

//Crea un proyectos
//api/proyectos
router.post("/",
auth,
[
    check("nombre","El nombre del proyecto es obligatorio").not().isEmpty()
],
crearProyecto)

//OBTENER TODOS LOS PROYECTOS
router.get("/",
auth,
obtenerProyectos)

//ACTUALIZA UN PROYECTO
router.put("/:id",
auth,
[check("nombre","El nombre del proyecto es obligatorio").not().isEmpty()
], actualizaProyecto)

router.delete("/:id",
auth,  eliminarProyecto)

module.exports=router;