
// node server.js para começar

const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');


const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'arquivos/imagens/animais',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg'); // Define o nome do arquivo com a extensão .jpg
  }
});
const upload = multer({ storage: storage });

const fs = require ('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());


const { insertUsuarios } = require('./src/auth/usuarios.js')
const { getAnimais, insertAnimais } = require('./src/auth/animais.js')
const { insertResgate } = require('./src/auth/resgate.js')

app.use(cors());

const run = require('./src/mysql/mysql.js');

function carregarMysqlDB() {
  run();
}

run()
setInterval(carregarMysqlDB, 2400000);

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secret-key');
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!!');
});


app.get('/usuario', verifyToken, async (req, res) => {
  const { codusursdk } = req.headers || {};

  async function buscaUsuario(){
    const usuario = await getUsuario(codusursdk);
    return usuario;
  }

  const usuario = await buscaUsuario();
  
  const usuarioJson = JSON.stringify(usuario.rows);
  res.send(usuario);
});

app.get('/animais', async (req, res) => {

  async function buscaAnimais(){
    const animais = await getAnimais();
    return animais;
  }

  const animais = await buscaAnimais();
  
  //const animaisJson = JSON.stringify(animais.rows);
  res.send(animais);

});


app.get('/usuariosSave', async (req, res) => {
  const {nome, email, celular, estado, cidade, senha} = req.headers || {};
  //console.log(nome+'  -  '+email+'  -  '+celular+'  -  '+estado+'  -  '+cidade+'  -  '+senha)

  let result
  result = await insertUsuarios(nome, email, celular, estado, cidade, senha)
  res.send(result);
}); 

app.post('/doe', verifyToken, upload.single('file'), async (req, res) => {
  const { tipo, nome, raca, porte, sexo, castrado, vacinado, idade, observacoes, coddoador, foto: fotobody } = req.body;
  
  const foto = req.file;
  const nomeArquivo = foto.filename;

  //console.log(`${tipo} - ${nome} - ${raca} - ${porte} - ${sexo} - ${castrado} - ${vacinado} - ${idade} - ${observacoes} - ${coddoador}`);
  
  upload.single(foto)

  let result
  result = await insertAnimais(tipo, nome, raca, porte, sexo, castrado, vacinado, idade, observacoes, coddoador, nomeArquivo)

  res.send(result);
});


app.post('/resgate', verifyToken, async (req, res) => {
  const { tipo, caracteristicas, motivo, estado, cidade, rua, ponto_referencia, urgencia, codusuario } = req.body;

  let result
  result = await insertResgate(tipo, caracteristicas, motivo, estado, cidade, rua, ponto_referencia, urgencia, codusuario)

  res.send(result);
});




app.use('/imagens/animais', express.static(path.join(__dirname, 'arquivos', 'imagens', 'animais')));

app.get('/imagens/animais', async (req, res) =>{
  const directoryPath = path.join(__dirname, 'arquivos', 'imagens', 'animais');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao ler o diretorio'});
    }

    const imageNames = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile())

    res.json({ images: imageNames });  
  })
})



app.listen(PORT, () => {
  console.log(`listen to port ${PORT}`);
});

app.post('/login', async (req, res) => {

  const { username, password } = req.headers || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'E-mail e/ou senha inválidos'  });
  }
  
  const auth = require('./src/auth/auth.js');

  async function buscaUsuario(){
    const usuario = await auth(username);
    return usuario;
  }
  
  const usuario = await buscaUsuario();

  if (!usuario[0][0]) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  if (!bcrypt.compareSync(password, usuario[0][0].senha)) {   
    
    return res.status(401).json({ message: 'Senha incorreta' });
  }
  
  // Gera o token JWT
  const token = jwt.sign({ userId: usuario[0][0].email }, 'secret-key');
  //const token = jwt.sign({ userId: usuario.rows[0].EMAIL }, 'secret-key', { expiresIn: '2h' });

  const id = usuario[0][0].id
  const email = usuario[0][0].email
  const nome = usuario[0][0].nome
  const celular = usuario[0][0].celular
  const estado = usuario[0][0].estado
  const cidade = usuario[0][0].cidade

  let d = new Date()
  console.log("login de: "+ email+ " às "+ d)
  res.json({ id, token, email, nome, celular, estado, cidade });

});



