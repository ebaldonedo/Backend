const express =require('express');
const conectarDB = require("./config/db")
const cors = require("cors")

//Crear servidor
const app = express();

//Conectar a base de datos
conectarDB();

//settings
app.use(express.json({extended:true}))
app.use(cors());

//puerto de la app
const PORT = process.env.PORT || 4000;


//Definir pagina principal
app.get("/", (req,res)=>{
    res.send("Hola mundo")
})

//Importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas",require("./routes/tareas"));
//start app
app.listen(PORT, ()=>{
    console.log(`Server working on PORT: ${PORT}`);
})




