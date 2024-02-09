/*carregar o express e definir uma constante router para as rotas*/
const express = require("express")
const router = express.Router()

router.get('/', (req, res) => {
    res.render("admin/index")
})

router.get('/receitas', (req, res) => {
    res.send("Página de receitas")
})

router.get("/categorias", (req, res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

module.exports = router