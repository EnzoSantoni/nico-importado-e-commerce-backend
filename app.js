const express = require('express');
const app = express();
const cors = require('cors');

const api_routes = require("./routes/index.routes")


//Middlewares
// CORS
app.use(cors())

// poder interpretar los datos que vienen en el body de una peticion
app.use(express.json())
//Share public folder
app.use(express.static("public"))



app.use("/api", api_routes)


module.exports = app;