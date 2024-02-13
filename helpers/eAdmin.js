/* criando um helper para verificar se um usuário é admin ou não, controlando o acesso de rotas dele */
module. exports = {
    eAdmin: function(req, res, next){

        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }

        req.flash("error_msg", "Você precisar ser um Admin!")
        res.redirect("/usuarios/login")
    }
}