const Usuario= require("../models/Usuario")
const bcryptjs= require("bcryptjs")
const {validationResult}= require("express-validator")
const jwt = require("jsonwebtoken");

exports.crearUsuario= async (req,res)=>{

    //0.-Revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores:errores.array()})
    }
    //1.-extraer email y password
    const {email, password}=req.body
   
    try {
        //2.-Revisar que el usuario sea unico
        let usuario = await Usuario.findOne({email});

        if (usuario) {
            return res.status(400).json({msg:"El usuario ya existe"})
        }

        //3.-Crea usuario
        usuario=new Usuario(req.body)

        //4.-Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password= await bcryptjs.hash(password, salt)

        //5.-guardar usuario
        await usuario.save();

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
        res.status(400).send('Hubo un error')
    }
}