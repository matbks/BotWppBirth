const express = require('express');
const mysql = require('mysql');
require('dotenv').config();


const connection = mysql.createConnection({
    host: process.env.DB_HOST , // Ajuste o hostname ou IP do servidor MySQL
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  
  

  const app = express();

  app.use(express.json());

// Criar um registro
app.post('/api/registros', (req, res) => {
    // Obtenha os dados do corpo da requisição
    const { number, role, birth } = req.body;
  
    // Execute a consulta SQL para inserir o registro no banco de dados
    const query = `INSERT INTO Aniversariantes (number, role, birth) VALUES (?, ?, ?)`;
    connection.query(query, [number, role, birth], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar registro' });
      }
  
      return res.status(201).json({ message: 'Registro criado com sucesso' });
    });
  });

// Ler todos os registros
app.get('/api/registros', (req, res) => {
  // Execute a consulta SQL para obter todos os registros da tabela
  const query = `SELECT * FROM Aniversariantes`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao obter registros' });
    }
    
    return res.status(200).json(results);
  });
});
 
// Atualizar um registro
app.put('/api/registros/:id', (req, res) => {
    const { id } = req.params;
    const { number, role, birth } = req.body;
    
    // Execute a consulta SQL para atualizar o registro no banco de dados
    const query = `UPDATE Aniversariantes SET campo1 = ?, campo2 = ? WHERE id = ?`;
    connection.query(query, [number, role, birth, id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar registro' });
      }
      
      return res.status(200).json({ message: 'Registro atualizado com sucesso' });
    });
  });
  
  // Excluir um registro
  app.delete('/api/registros/:id', (req, res) => {
    const { id } = req.params;
    
    // Execute a consulta SQL para excluir o registro do banco de dados
    const query = `DELETE FROM Aniversariantes WHERE id = ?`;
    connection.query(query, [id], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao excluir registro' });
      }
      
      return res.status(200).json({ message: 'Registro excluído com sucesso' });
    });
  });
  
  app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
  });