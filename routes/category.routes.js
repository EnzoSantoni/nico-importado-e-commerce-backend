const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");




// GET categories
router.get("/categories",  categoryController.getCategories)
// POST categories
router.post("/categories",[auth, isAdmin], categoryController.createCategory)
// PUT categories




module.exports = router;