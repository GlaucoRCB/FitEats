/* 1º instalar e carregar o módulo express
 comandos:
  npm -v
  npm install express --save  
 */
const express = require("express");
/* 2º Definindo uma constante para receber o express 
(obs:constante para evitar sobreescrever essa variavel app e express) */
const app = express();
/* 6º instalar e carregar o módulo handlebars*/
const handlebars = require('express-handlebars')
/* 11º instalar e carregar o body parser para receber dados de qualquer formulário */
const bodyParser = require('body-parser')
/* 12º instalar e carregar o banco de dados mongoose */
const mongoose = require("mongoose")
/*trazendo as rotas do admin para o programa principal*/
const admin = require("./routes/admin")
/*carregar o path arquivos estaticos do css e js para facilitar a criação do css */
const path = require('path')
/*carregando modulos session e flash instalados com os comandos
    npm install --save express-session
    npm install --save connect-flash
    para fazer autenticação e validação de dados
*/
const session = require("express-session")
const flash = require("connect-flash")
/* carregar os models receita e categorias */
require("./models/Receita")
const Receita = mongoose.model("receitas")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
/* carregando o model de usuarios na aplicação principal */
const usuarios = require("./routes/usuario")
/* carregando a authenticação */
const passport = require("passport");
const {eAdmin} = require("./helpers/eAdmin")
require("./config/auth")(passport)
// Configurações
/*configurando a session e o flash */
    app.use(session({
        secret: "geladeiratsunami123",
        resave: true,
        saveUninitialized: true
    }))
    /* configurando o passport */
    app.use(passport.initialize())
    app.use(passport.session())


    app.use(flash())
    /*Colocando um middleware ele precisa ter req, res, next*/
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next()
    })

    /* configurando multer */
    
/* 7º Config
    Template Engine
    nesta área definiremos o nosso padrão template
    */
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main', runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
         },
     }))
    app.set('view engine', 'handlebars')
    /* 12º body parser config */
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json()) 

    /* public config "comando __dirname" para pegar o caminho absoluto para a pasta public  */
    app.use(express.static(path.join(__dirname,"public")))
    
    /* configurando o mongoose para se conectar as informações ao banco de dados*/
    mongoose.Promise = global.Promise;
     mongoose.connect("mongodb://localhost/FitEats").then(() => {
        console.log("Conectado ao mongo")
     }).catch((err) => {
        console.log("Erro ao se conectar: "+err)
     })

/* 4º Definir uma rota para mostrar a aplicação */  
/* rota principal para listar as receitas */
app.get("/", (req, res) => {
    Receita.find().sort({date:'desc'}).then((receitas) => {
        Categoria.find().then((categorias) => {
            receitas.map((element) => {
                element.categoria = categorias.find(x=>x.id==element.categoria)
            })
            res.render("index", {receitas: receitas, categorias: categorias})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })
})
/* rota para acessar o leia mais */
app.get("/receita/:slug", (req, res) => {
    Receita.findOne({slug: req.params.slug}).then((receita) =>{
        if(receita){
            res.render("receita/index", {receita: receita})
        }else{
            req.flash("error_msg", "Esta receita não  existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/")
    })
})
/* rota de erro */
app.get("/404", (req, res) => {
    res.send("Erro 404!")
})
/* rota para listar as categorias */
app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        if(categoria){
            Receita.find({categoria: categoria._id}).then((receitas) => {
                res.render("categorias/receitas", {receitas: receitas, categoria: categoria})
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar as receitas!")
                res.redirect("/")
            })
        }else{
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }
}).catch((err) =>{
    req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
    res.redirect("/")
})
})


/* 8º Definir uma rota para cadastrar as postagens */
/* 9º Loco em seguida criar o arquivo html handlebars que será renderizado */
app.get('/cadposts', (req, res) => {
    res.render('cadposts')
})

/* 10º Definir uma rota para receber as postagens e linkar essa rota ao formulário html no handlebars */
app.post('/receitarecebida', (req, res) => {
    req.body.nomeDaReceita
    res.send('Nova receita recebida!')
})

/*colocando para o arquivo principal as rota admin*/
app.use('/admin', admin)
app.use("/usuarios", usuarios)





/* 3º definir uma porta para rodar nossa aplicação
 comando para o servidor rodar na porta desejada:
app.listen 
*/
const PORT = 8090
app.listen(8090, () => {
    console.log("Servidor Rodando na url http://localhost:8090");
});