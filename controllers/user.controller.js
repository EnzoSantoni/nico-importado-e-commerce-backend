const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;


async function getUserById(req, res) {
    try {
        
        const id = req.params.id;
        const user = await User.findById(id).select({password: 0});
        
        //Si no se encuentra el usuario
        if(!user) {
            return res.status(404).send({
                ok: false,
                massege:"No se encontro el usuario"
            })
        }

        res.status(200).send({
            ok: true,
            massege: "Se obtuvo el usuario correctamente",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: true,
            message: "No se pudo obtener usuario"
        })
    }
}

async function getUsers(req, res) {
    
    try {
        console.log(req.query)
        const limiteUsuarios = req.query.limit || 2;
        const page = req.query.page || 0;

        const [users, total] = await Promise.all([
            User.find()
                .select({password: 0, __v: 0})
                .collation({ locale: 'es' })
                .sort({ fullname: "asc" })
                .limit(limiteUsuarios)
                .skip(page * limiteUsuarios),   // Peticion 1 
            
                User.countDocuments()           // Peticion 2
        ])


        
        // const users = await User.find()
        //                         .select({password: 0, __v: 0})
        //                         .collation({ locale: 'es' })
        //                         .sort({ fullname: "asc" })
        //                         .limit(limiteUsuarios)
        //                         .skip(page * limiteUsuarios);  // 0 * 100 = 100
        

        // const total = await User.countDocuments();

        res.status(200).send({
            ok: true,
            message: 'Usuarios obtenidos correctamente',
            users,
            total
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok:false,
            message: "Error al obtener usuarios"
        })
    }

}

async function postUsers(req, res) {

    try {
        // Si me mandan el dato role y el usuario no es admin, entonces se lo asigno como cliente
        if(req.user?.role !== "ADMIN_ROLE") {

            req.body.role = "CLIENT_ROLE";
        }


        // Encriptar la contrasenia antes de guardar
        req.body.password = await bcrypt.hash(req.body.password, saltRounds)
        
        const user = new User(req.body);

        const newUser = await user.save();
        // Borrar la propiedad password antes de responder a quien realizo la peticion con los datos del nuevo usuario 
        newUser.password = undefined;

        res.status(201).send(newUser);

    } catch (error) {
        res.status(500).send("Error al cargar el usuario")
        console.log(error)
    }
}

async function deleteUsers(req, res) {
    
    try {

        
        
        const idUserToDelete = req.params.id;

        const deletedUser = await User.findByIdAndDelete(idUserToDelete)

        if(!deletedUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontro el usuario que deseaba borrar"
            })
        }

        res.status(200).send({
            ok: true,
            message: "El usuario fue borrado correctamente"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            message: "Error al borrar el usuario"
        })
    }

    
}

async function updateUser(req, res) {

    try {
        const id = req.params.id;

        if(req.user.role !== 'ADMIN_ROLE' && req.user._id !== id) {
            return res.status(400).send({
                ok: false,
                message: "No puede editar este usuario"
            })
        }

        const newData = req.body;

        //TODO: Hashear password en el update
        newData.password = undefined;
        //TODO: Resetear Role
        if(req.user.role !== 'ADMIN_ROLE') {
            newData.role = undefined;
        }



        const updUser = await User.findByIdAndUpdate(id, newData, {new: true});

        if(!updUser) {
            return res.status(404).send({
                ok: false,
                message: "No se encontro el usuario"
            })
        }

        res.status(200).send({
            ok: true,
            message: "Usuario actualizado correctamente"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            ok: false,
            message:"No se pudo editar usuario"
        })
    }
}

async function login(req, res) {
    try {
        // Obtener email y password que me envia el usuario en el body
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password) {
            return res.status(400).send({
                ok: false,
                message: "Email y password son requeridos"
            })
        };
        // Checkear si el usuario existe y de ser asi lo obtengo
        // const user = await User.findOne({email: { $regex: new RexExp(email, "i") }})
        const user = await User.findOne({email: { $regex: email, $options: "i" }});

        // Si el usuario no existe devuelvo un 404
        if(!user) {
            return res.status(404).send({
                ok: false,
                message: "Datos incorrectos"
            })
        };
        // Comparar el password que me envio con el que tengo guardado en la base de datos(el password de la DB esta hasheado entonces usamos bcrypt para comprarar)
        const match = await bcrypt.compare(password, user.password);
        // Si los datos no coinciden devolver error
        if(!match) {
            return res.status(400).send({
                ok: false,
                message: "Datos incorrectos"
            })
        }

        user.password = undefined;

        const token = jwt.sign(user.toJSON(), SECRET, {expiresIn: '1h'})

        console.log(token)

        // Generar un token de login

        // Si esta todo ok hacemos devolvemos una respuesta favorable
        res.status(200).send({
            ok: true,
            message: "Login Correcto!",
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            ok: false,
            message: "Error al hacer login"
        })
    }
    
}



module.exports = {
    getUsers,
    postUsers,
    deleteUsers,
    updateUser,
    getUserById,
    login
}