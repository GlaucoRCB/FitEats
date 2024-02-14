/*carregar o express e definir uma constante router para as rotas*/
const express = require("express")
const router = express.Router()
/*Carregar o mongoose também no arquivo admin*/
const mongoose = require("mongoose")
/*Carregar também o model Categorias para poder puxar o formulario para rota*/
/*usando o model de forma externa dentro do mongoose */
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
/* carregar o model das receitas */
require("../models/Receita")
const Receita = mongoose.model("receitas")
/* Carregando os helpers */
const {eAdmin} = require("../helpers/eAdmin")



router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")
})
/* listando as receitas cadastradas */
router.get("/receitas", eAdmin, (req, res) => {
    Receita.find().sort({date:'desc'}).then((receitas) => {
        Categoria.find().then((categorias) => {
            receitas.map((element) => {
                element.categoria = categorias.find(x=>x.id==element.categoria)
            })
        res.render("admin/receitas", {receitas: receitas, categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as receitas")
        res.redirect("/admin")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as receitas")
        res.redirect("/admin")
        })
    })
})

router.get("/categorias", eAdmin, (req, res) => {
    /*listando categorias para serem exibidas no site função date :'desc usada para listar por ordem de criação */
    Categoria.find().sort({date:'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

/*Receberá os dados do formulario e enviara para o mongo (banco de dados) */
router.post("/categorias/nova", eAdmin, (req, res) => {
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
/*rota de edição de categorias */
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    /* findOne para buscar 1 só pelo id */
    Categoria.findOne({_id:req.params.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe!")
        res.redirect("/admin/categorias")
    })
})
/* rota que ira passar os valores da edição para categoria */
router.post("/categorias/edit", eAdmin, (req, res) => {

    Categoria.findOne({_id: req.body.id}).then((categoria) => {

        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a edição da categoria.")
            res.redirect("/admin/categorias")
        })

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })
})
/* criando uma rota para deletar a categoria ele te leva pra essa rota deleta a categoria e volta pra rota normal mostrando ela atualizada */
router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria.")
        res.redirect("/admin/categorias")
    })
})
/* rota para listar as receitas */
router.get("/receitas", eAdmin, (req, res) => {
    res.render("admin/receitas")
})
/* rota para adicionar novas receitas */
router.get("/receitas/add", eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addreceitas", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})
/* rota para enviar os dados para o banco de dados das novas receitas */
router.post("/receitas/nova", upload.single('receita_imagem'), eAdmin, (req, res) => {
    console.log(req.file)
    /* validando os dados da postagem da receita */
    var erros = []

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }
    
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Digite um título"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Digite um slug"})
    }

    if(!req.body.ingredientes || typeof req.body.ingredientes == undefined || req.body.ingredientes == null){
        erros.push({texto: "Digite os ingredientes"})
    }
    if(!req.body.modopreparo || typeof req.body.modopreparo == undefined || req.body.modopreparo == null){
        erros.push({texto: "Digite os ingredientes"})
    }
    if(erros.length > 0){   
        res.render("admin/addreceitas", {erros: erros})
    }else{
        const novaReceita = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            modopreparo: req.body.modopreparo,
            ingredientes: req.body.ingredientes,
            categoria: req.body.categoria,
        }

        new Receita(novaReceita).save().then(() => {
            req.flash("success_msg", "Receita criada com sucesso!")
            res.redirect("/admin/receitas")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao criar a receita.")
            res.redirect("/admin/receitas")
        })
    }
})
/* rota para edição de receitas */
router.get("/receitas/edit/:id", eAdmin, (req, res) => {
    /* findOne para buscar 1 só pelo id */
    Receita.findOne({_id:req.params.id}).then((receita) => {
        /* fazendo duas buscas seguidas para renderizar os dados */
        Categoria.find().then((categorias) => {
            res.render("admin/editreceitas", {categorias: categorias, receita: receita})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as receitas.")
            res.redirect("/admin/receitas")
        })
        
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/receitas")
    })
})
/* rota para postar as edições */
router.post("/receitas/edit", eAdmin, (req, res) => {
    Receita.findOne({_id: req.body.id}).then((receita) => {

        receita.titulo = req.body.titulo
        receita.slug = req.body.slug
        receita.ingredientes = req.body.ingredientes
        receita.modopreparo = req.body.modopreparo
        receita.categoria = req.body.categoria

        receita.save().then(() => {
            req.flash("success_msg", "Receita editada com sucesso!")
            res.redirect("/admin/receitas")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a receita.")
            res.redirect("/admin/receitas")
        })


    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a edição.")
        res.redirect("/admin/receitas")
    })
})
/* rota para deletar as receitas */
router.get("/receitas/deletar/:id", eAdmin, (req, res) => {
    Receita.deleteOne({_id: req.params.id}).then(() => {
        req.flash("success_msg", "Receita deletada com sucesso!")
        res.redirect("/admin/receitas")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/admin/receitas")
    })
})

module.exports = router