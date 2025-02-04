const mysql = require('mysql2/promise');

async function getAnimais() {
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
      select animais.*, especies.nome especie, especies.habitat_natural habitat, especies.expectativa_vida expectativa 
      from animais
      left join especies on animais.idespecie = especies.idespecie;
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


async function insertAnimais(especie, nome, porte, observacoes, nomefoto) {
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
    const values = [especie, nome, porte, observacoes, nomefoto];

    // Execute a consulta SQL com os valores dos parâetros
    const [result] = await connection.execute(`
      INSERT INTO animais (idespecie, nome, porte, observacoes, nomefoto) 
      VALUES (?, ?, ?, ?, ?)
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


module.exports = { getAnimais, insertAnimais };
