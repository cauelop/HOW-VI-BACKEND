const mysql = require('mysql2/promise');

async function getAnimais() {
  let connection;

  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'sospets' // Nome do banco de dados MySQL
    });

    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      select animais.*, usuario.celular from animais
      left join usuario on usuario.id = animais.idusuario;
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


async function insertAnimais(tipo, nome, raca, porte, sexo, castrado, vacinado, idade, observacoes, idusuario, nomefoto) {
  let connection;
  
  try {
    // Crie uma conexão com o MySQL
    connection = await mysql.createConnection({
      host: 'localhost', // Endereço do servidor MySQL
      user: 'root', // Nome de usuário do MySQL
      password: 'clbclb10', // Senha do usuário do MySQL
      database: 'sospets' // Nome do banco de dados MySQL
    });
  
    // Crie um array com os valores dos parâmetros
    const values = [tipo, nome, raca, porte, sexo, castrado, vacinado, idade, observacoes, idusuario, nomefoto];
  
    // Execute a consulta SQL com os valores dos parâmetros
    const [result] = await connection.execute(`
      INSERT INTO animais (tipo, nome, raca, porte, sexo, castrado, vacinado, idade, observacoes, idusuario, nomefoto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
