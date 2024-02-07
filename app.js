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

/* 7º Config
    Template Engine
    nesta área definiremos o nosso padrão template
    */
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    /* 12º body parser config */
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json()) 

/* 4º Definir uma rota para mostrar a aplicação */  
app.get("/", (req, res) => {
    res.send("Seja bem vindo ao meu app!")
});

/* 5º Definição de parametros utiliza ":" */
/* app.get('/ola/:nome/:cargo', (req, res) => {
    res.send(req.params);
}) */

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






/* 3º definir uma porta para rodar nossa aplicação
 comando para o servidor rodar na porta desejada:
app.listen 
*/
app.listen(8090, () => {
    console.log("Servidor Rodando na url http://localhost:8090");
});