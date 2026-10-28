const router = require('express').Router();
const orderController = require('../controllers/order.controller')
const auth = require('../middlewares/auth')
// const isAdmin = require('../middlewares/isAdmin')

// Crear order
router.post("/orders", auth, orderController.postOrder)
// Obtener ordenes TODAS LAS ORDENES (caso de user admin, user employee)
router.get('/orders{/:idUser}', auth, orderController.getOrder)
// Obtener una orden especifica por ID de IdOrder
// router.get('/orders/:id', orderController.getOrderById)
// Obtener ordenes por ID de usuario
// router.get('/orders/users/:id', orderController.getOrderByUserId)
// Editar una Orden
// router.put('/orders/:id', orderController.putOrder)
// Borrar orden va a depender de nuestra app (opcional)
// router.delete('/orders/:id', orderController.deleteOrder)

module.exports = router;