const mysql = require('mysql2/promise');

async function getEspecies() {
  let connection;

  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'projeto how vi' // Nome do banco de dados MySQL
    });

    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      select * from especies;
    `);

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


async function insertEspecies(nome, habitat_natural, expectativa_vida, idespecie) {
  let connection;
  
  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'projeto how vi' // Nome do banco de dados MySQL
    });
  
    // Crie um array com os valores dos parâmetros
    const values = [nome, habitat_natural, expectativa_vida];
  
    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      INSERT INTO Especies (nome, habitat_natural, expectativa_vida) 
      VALUES (?, ?, ?)
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


module.exports = { getEspecies, insertEspecies };
