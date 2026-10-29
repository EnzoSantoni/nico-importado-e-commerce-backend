const express = require('express');
const app = express();
const cors = require('cors');
const { rateLimit} = require('express-rate-limit')
const api_routes = require("./routes/index.routes")

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 25,
    message: {
        ok: false,
        message: "Ha excedido el numero de peticiones"
    }
})

app.use(limiter)

//Middlewares
// CORS
app.use(cors())

// poder interpretar los datos que vienen en el body de una peticion
app.use(express.json())
//Share public folder
app.use(express.static("public"))



app.use("/api", api_routes)


module.exports = app;