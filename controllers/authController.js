const Usuario= require("../models/Usuario")
const bcryptjs= require("bcryptjs")
const {validationResult}= require("express-validator")
const jwt = require("jsonwebtoken");

exports.autenticarUsuario= async (req,res)=>{
    //0.-Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores:errores.array()})
    }

    //extraer email y password
    const {email, password}= req.body

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({email})
        if (!usuario) {
            return res.status(400).json({msg:"El usuario no existe"})
        }

        //revisar el password
        const passCorrecto = await bcryptjs.compare(password,usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({msg:"password incorrecto"})
        }

        //Si todo es correcto
        //Crear y formar el JWT
        const payload={
            usuario:{
                id:usuario.id
            }
        }

        //Firmar el JWT
        jwt.sign(payload,process.env.SECRETA,{
            expiresIn:3600//1 hora
        }, (error,token)=>{
            if (error) throw error


        //6.-Confirmacion
        res.json({token});
        })
    } catch (error) {
        console.log(error);
    }
}


//USUARIO AUTENTICADO
exports.usuarioAutenticado = async(req,res)=>{
    try {
        const  usuario= await Usuario.findById(req.usuario.id.trim()).select("-password");
        res.json({usuario})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"hubo un error al autenticar el usuario"})
    }
}