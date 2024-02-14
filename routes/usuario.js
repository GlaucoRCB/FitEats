/* Carregando os modulos para a rota usuario */
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")
/* importando o bcrypt para criptografar a senha */
const bcrypt = require("bcryptjs")
const passport = require("passport")
/* carregando helpers */
/* rota de registro do usuario */
router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

/* rota de validação de dados da criação do usuario */
router.post("/registro", (req, res) => {
    var erros = []

    if(!req.body.nome){
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.email){
        erros.push({texto: "Email inválido"})
    }
    if(!req.body.senha){
        erros.push({texto: "Senha inválida"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }
    if(erros.length > 0){

        res.render("usuarios/registro", {erros: erros})

    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com este email")
                res.redirect("/usuarios/registro")
            }else{
                /* passando os dados do usuario */
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })
                /* encryptando a senha */
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/usuarios/registro")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(() => {
                            req.flash("success_msg", "Usuário criado com sucesso!")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                            res.redirect("/usuarios/registro")
                        })

                    })
                })


            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

/* rota de login */

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)

})

/* rota de lougout */

router.get("/logout", (req, res, next) => {

    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash('success_msg', "Deslogado com sucesso!")
        res.redirect("/")
    })
})
/* lembrar de exportar a router */
module.exports = router