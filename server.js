// backend/server.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./backend/database.db");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    cargo TEXT
)`);

// Listar todos
app.get("/clientes", (req, res) => {
    db.all("SELECT * FROM clientes", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Adicionar
app.post("/clientes", (req, res) => {
    const { nome, email, telefone, endereco, cargo } = req.body;
    db.run(`INSERT INTO clientes (nome, email, telefone, endereco, cargo)
            VALUES (?, ?, ?, ?, ?)`,
        [nome, email, telefone, endereco, cargo],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Editar
app.put("/clientes/:id", (req, res) => {
    const { nome, email, telefone, endereco, cargo } = req.body;
    db.run(`UPDATE clientes SET nome=?, email=?, telefone=?, endereco=?, cargo=? WHERE id=?`,
        [nome, email, telefone, endereco, cargo, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// Deletar
app.delete("/clientes/:id", (req, res) => {
    db.run(`DELETE FROM clientes WHERE id=?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
