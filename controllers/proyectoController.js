const Proyecto = require("../models/Proyecto");
const {validationResult}=require("express-validator")
exports.crearProyecto= async (req,res)=>{
 
    //0.-Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores:errores.array()})
    }    

    try {
        //Crear un nuevo proyecto
        const proyecto= new Proyecto(req.body)

        //guardar al creador via JWT
        proyecto.creador= req.usuario.id;

        //guardar nuevo proyecto
        proyecto.save();
        res.json(proyecto)

    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }
}

//obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req,res)=>{
    try {
        const proyectos= await Proyecto.find({creador:req.usuario.id})
        res.json({proyectos})
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error")
    }

    
}

//Actualiza un proyecto

exports.actualizaProyecto = async(req,res)=>{

    //0.-Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores:errores.array()})
    }  
    //extraer la informacion del proyecto
    const {nombre}= req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;

    }

    try {
        //revisar el id
        console.log("ID:"+req.params.id);
        //consulta a DB
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg:"proyecto no encontrado"})
        }
        //verificar el creador del proyecto
        if (proyecto.creador.toString()!==req.usuario.id) {
            return res.status(401).json({msg:"No autorizado!"})
        }
        //actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id:req.params.id}, {$set:nuevoProyecto},{new:true})
        return res.json({proyecto})
    } catch (error) {
        console.log(error);
        res.status(500).send("Error actulizando usuario")
    }
    

}


//Eliminar proyecto

exports.eliminarProyecto = async (req,res)=>{
    try {
     //revisar el id
        console.log("ID:"+req.params.id);
        //consulta a DB
        let proyecto = await Proyecto.findById(req.params.id);

        //si el proyecto existe o no
        if (!proyecto) {
            return res.status(404).json({msg:"proyecto no encontrado"})
        }
        //verificar el creador del proyecto
        if (proyecto.creador.toString()!==req.usuario.id) {
            return res.status(401).json({msg:"No autorizado!"})
        }  
        
        await Proyecto.findOneAndRemove({_Id:req.params.id})
        res.json({msg:"Proyecto eliminado con exito"})

    } catch (error) {
        console.log(error);
        res.status(500).send("Error Eliminando Prpyecto")
    }

   
}