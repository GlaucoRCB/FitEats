/*carregar o express e definir uma constante router para as rotas*/
const express = require("express")
const router = express.Router()
/*Carregar o mongoose também no arquivo admin*/
const mongoose = require("mongoose")
/*Carregar também o model Categorias para poder puxar o formulario para rota*/
/*usando o model de forma externa dentro do mongoose */
require("../models/Categoria")
const Categoria = mongoose.model("categorias")

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

/*Receberá os dados do formulario e enviara para o mongo (banco de dados) */
router.post("/categorias/nova", (req, res) => {
    /*fazendo a validação de dados, que irão ser inseridos ou não no app */
    var erros = []
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Digite um nome"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Digite um slug"})
    }
    
    if(erros.length > 0){   
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            /*passando dados que serão inseridos ao banco de dados*/
            nome: req.body.nome,
            slug: req.body.slug
        }
        /*Criando uma nova categoria*/
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin/categorias/add")
        })
    }
})




module.exports = router