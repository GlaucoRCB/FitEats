/* criando model para registrar as receitas */
/* carregando o os modulos*/
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

/* definindo oque uma receita precisa para ser feita */
const Receita = new Schema({
    titulo: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },
    modopreparo: {
        type: String,
        required: true
    },
    ingredientes: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("receitas", Receita)