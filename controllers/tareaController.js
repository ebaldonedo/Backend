const Tarea = require("../models/Tarea")
const Proyecto = require("../models/Proyecto")
const { validationResult } = require("express-validator")

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //0.-Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }



    try {
        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" })
        }

        //verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No autorizado!" })
        }
        const tarea = new Tarea(req.body)
        await tarea.save();
        res.json({ tarea })



    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un Error" })
    }

}

//obtiene las tareas por poryecto
exports.obtenerTareas = async (req, res) => {
    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        console.log(req.query);
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: "Proyecto no encontrado" })
        }

        //verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No autorizado!" })
        }

        //Obtener las tareas por proyecto
        const tarea = await Tarea.find({ proyecto });
        res.json({ tarea })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un Error" })
    }
}

//ACTUALIZAR TAREA
exports.actualizarTarea = async (req, res) => {
    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;

        //Si la tarea existe o no

        let id = req.params.id.trim()
        let tarea = await Tarea.findById(id)

        if (!tarea) {
            return res.status(404).json({ msg: "La tarea no existe" })
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        //verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No autorizado!" })
        }

        //crear objeto con la nueva informacion

        let nuevaTarea = {}

            nuevaTarea.nombre = nombre;

            nuevaTarea.estado = estado


        //guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id.trim() }, nuevaTarea, { new: true })
        res.json({ tarea })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un Error actualiznado la tarea" })
    }
}

exports.eliminarTarea= async (req, res)=>{
    try {

        //Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;

        //Si la tarea existe o no

        let id = req.params.id.trim()
        let tarea = await Tarea.findById(id)
        console.log("ELIMINANDO TAREA: "+id);

        if (!tarea) {
            return res.status(404).json({ msg: "La tarea no existe" })
        }

        //extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        //verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: "No autorizado!" })
        }

        //crear objeto con la nueva informacion

        //Eliminar
        
        await Tarea.findByIdAndDelete(id)
        res.json({msg:"Tarea Eliminada"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Hubo un Error actualiznado la tarea" })
    }    
}