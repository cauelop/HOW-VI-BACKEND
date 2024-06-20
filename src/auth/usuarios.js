const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function insertUsuarios(nome, email, celular, estado, cidade, senha) {
  let connection;

  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'projeto how vi' // Nome do banco de dados MySQL
    });

    const senhaHash = bcrypt.hashSync(senha, 10);

    // Crie um array com os valores dos parâmetros
    const values = [nome, email, celular, estado, cidade, senhaHash];

    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      INSERT INTO USUARIO(NOME, EMAIL, CELULAR, ESTADO, CIDADE, SENHA) 
      VALUES(?, ?, ?, ?, ?, ?)
    `, values);

    await connection.commit();

    return result;

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


module.exports = { insertUsuarios };
