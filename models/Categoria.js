/*Carregando o mongo nas models para poder salvar os dados e o Schema*/
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
/*Definindo uma contante para chamar o new Schema para salvar no banco de dados novas categorias*/
const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    /*Default: date.now() servindo para um padrão puxar a hora atual que foi postada no site */
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)