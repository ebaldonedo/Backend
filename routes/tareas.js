const express= require("express");
const tareaController= require("../controllers/tareaController");
const router = express.Router();
const auth =require("../middlewares/auth")
const {check} =require("express-validator")

//crear una tarea
//api/tareas

router.post("/",
auth,
[
check("nombre","El nombre es obligatorio").not().isEmpty(),
check("proyecto", "El proyecto es obligatorio").not().isEmpty()    
],
tareaController.crearTarea)

//Obtener tareas por proyectos
router.get("",
auth,
tareaController.obtenerTareas)

//Actualizar tarea
router.put("/:id",
auth,
tareaController.actualizarTarea
)

router.delete("/:id",
auth,
tareaController.eliminarTarea)

module.exports= router