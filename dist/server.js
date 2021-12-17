"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === "development" ? ".env.development" : ".env"
});
database_1.default.schema.createTableIfNotExists('usuarios', (table) => {
    table.increments();
    table.string('username');
    table.string('email');
    table.string('password');
    table.timestamps();
}).then(() => console.log('Tabela de usuários criada com sucesso'))
    .catch((erro) => console.log(erro));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
//leitura dos usuarios
app.get('/usuarios', (req, res) => {
    database_1.default.select().table('usuarios')
        .then(usuarios => {
        console.log(usuarios);
        res.json({
            status: 'ok',
            mensagem: 'requisição com GET',
            usuarios: usuarios
        });
    }).catch(erro => console.log(erro));
});
//criação de usuários
app.post('/usuarios', (req, res) => {
    let usuario = req.body;
    usuario.created_at = new Date();
    (0, database_1.default)('usuarios').where('email', usuario.email)
        .then(usuarios => {
        if (usuarios.length > 0) {
            res.json({
                status: 'erro',
                mensagem: 'E-mail já cadastrado na base de dados'
            });
        }
        else {
            (0, database_1.default)('usuarios').insert(usuario)
                .then((dados) => {
                console.log('Usuário inserido com sucesso!');
                res.json({
                    status: 'ok',
                    mensagem: 'Usuário inserido com sucesso',
                    dados: dados
                });
            })
                .catch(erro => {
                res.json({
                    status: 'erro',
                    mensagem: 'Erro ao inserir usuário',
                    erro: erro
                });
            });
        }
    }).catch(erro => console.log(erro));
});
app.patch('/usuarios/:id', (req, res) => {
    let id = req.params.id;
    let usuario = req.body;
    usuario.updated_at = new Date();
    (0, database_1.default)('usuarios').where('id', id).update(usuario)
        .then(resultado => {
        if (resultado == 1) {
            res.json({
                status: 'ok',
                mensagem: 'Usuário atualizado com sucesso!'
            });
        }
        else {
            res.json({
                status: 'warning',
                mensagem: 'Nenhum registro atualizado'
            });
        }
    }).catch(erro => console.log(erro));
});
app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    (0, database_1.default)('usuarios').where('id', id).delete()
        .then((resultado) => {
        if (resultado == 1) {
            res.json({
                status: 'ok',
                mensagem: 'Usuário deletado com sucesso'
            });
        }
        else {
            res.json({
                status: 'warning',
                mensagem: 'Nenhum registro encontrado para deletar'
            });
        }
    })
        .catch(erro => {
        res.json({
            status: 'erro',
            mensagem: erro
        });
    });
});
app.listen(port, () => console.log('Servidor rodando normalmente ...'));
