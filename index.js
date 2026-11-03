require('dotenv').config();
const PORT = process.env.PORT || 3000;

const mongoose = require('mongoose')

const app = require('./app')

mongoose.connect(process.env.MONGO_URL)
            .then(() => {
                console.log('\x1b[35m Conectado a la DB \x1b[37m');

                app.listen(PORT, () => {
                    console.log(`\x1b[36m Servidor funcionando en puerto ${PORT} \x1b[37m`);
                });

            })
            .catch(error => console.log(error))




